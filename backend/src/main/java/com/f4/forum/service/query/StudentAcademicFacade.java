package com.f4.forum.service.query;

import com.f4.forum.dto.response.CertificateDTO;
import com.f4.forum.dto.response.PlacementTestDTO;
import com.f4.forum.dto.response.StudentAcademicResponse;
import com.f4.forum.entity.Attendance;
import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.Result;
import com.f4.forum.entity.Submission;
import com.f4.forum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentAcademicFacade {

    private final StudentQueryService studentQueryService;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final SubmissionRepository submissionRepository;
    private final ResultRepository resultRepository;
    private final UserAccountRepository userAccountRepository;

    public StudentAcademicResponse getStudentTranscript(String username) {
        var userAccount = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User account not found: " + username));
        
        Long studentId = userAccount.getUser().getId();

        // Sử dụng Virtual Threads cho các I/O tasks
        try (ExecutorService virtualExecutor = Executors.newVirtualThreadPerTaskExecutor()) {
            
            // Luồng 1: Lấy Profile (gồm PlacementTests và Certificates)
            CompletableFuture<List<PlacementTestDTO>> placementTestsFuture = CompletableFuture.supplyAsync(
                () -> studentQueryService.getStudentProfile(studentId).placementTests(), virtualExecutor);
            
            CompletableFuture<List<CertificateDTO>> certificatesFuture = CompletableFuture.supplyAsync(
                () -> studentQueryService.getStudentProfile(studentId).certificates(), virtualExecutor);

            // Luồng 2: Lấy thông tin Các khóa học (Enrollments + Aggregation)
            CompletableFuture<List<StudentAcademicResponse.CourseResultRecord>> courseResultsFuture = CompletableFuture.supplyAsync(() -> {
                List<Enrollment> enrollments = enrollmentRepository.findEnrollmentsByStudentId(studentId);
                
                return enrollments.stream().map(enrollment -> {
                    // Fetch Attendances
                    List<Attendance> attendances = attendanceRepository.findByEnrollmentId(enrollment.getId());
                    int totalSessions = attendances.size();
                    int presentSessions = (int) attendances.stream().filter(a -> Boolean.TRUE.equals(a.getIsPresent())).count();
                    int absentSessions = totalSessions - presentSessions;
                    double attendancePercentage = totalSessions == 0 ? 0.0 : ((double) presentSessions / totalSessions) * 100;
                    
                    var attendanceStats = new StudentAcademicResponse.AttendanceStats(
                        totalSessions, presentSessions, absentSessions, attendancePercentage
                    );

                    // Fetch Submissions
                    List<Submission> submissions = submissionRepository.findByStudentIdAndClassIdWithAssignment(
                        studentId, enrollment.getClassEntity().getId()
                    );
                    
                    List<StudentAcademicResponse.SubmissionRecord> assignmentScores = submissions.stream()
                        .map(sub -> new StudentAcademicResponse.SubmissionRecord(
                            sub.getId(),
                            sub.getAssignment().getTitle(),
                            sub.getScore(),
                            sub.getAssignment().getMaxScore(),
                            sub.getTeacherComment(),
                            sub.getStatus() != null ? sub.getStatus().name() : null
                        )).collect(Collectors.toList());

                    // Fetch Final Result
                    StudentAcademicResponse.FinalResultRecord finalResultRecord = null;
                    Result result = resultRepository.findByEnrollmentId(enrollment.getId()).orElse(null);
                    if (result != null) {
                        finalResultRecord = new StudentAcademicResponse.FinalResultRecord(
                            result.getMidtermScore(),
                            result.getFinalScore(),
                            result.getGrade(),
                            result.getTeacherComment()
                        );
                    }

                    return new StudentAcademicResponse.CourseResultRecord(
                        enrollment.getId(),
                        enrollment.getClassEntity().getCourse().getName(),
                        enrollment.getClassEntity().getClassCode(),
                        attendanceStats,
                        assignmentScores,
                        finalResultRecord
                    );
                }).collect(Collectors.toList());
            }, virtualExecutor);

            // Chờ tất cả hoàn thành và gộp
            CompletableFuture.allOf(placementTestsFuture, certificatesFuture, courseResultsFuture).join();

            return new StudentAcademicResponse(
                placementTestsFuture.join(),
                certificatesFuture.join(),
                courseResultsFuture.join()
            );
        }
    }
}
