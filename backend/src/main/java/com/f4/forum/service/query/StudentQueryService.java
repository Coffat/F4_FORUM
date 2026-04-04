package com.f4.forum.service.query;

import com.f4.forum.dto.response.StudentDashboardResponse;
import com.f4.forum.dto.response.StudentProfileResponse;
import com.f4.forum.dto.response.PlacementTestDTO;
import com.f4.forum.dto.response.CertificateDTO;
import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.Student;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.StudentRepository;
import com.f4.forum.repository.PlacementTestRepository;
import com.f4.forum.repository.CertificateRepository;
import com.f4.forum.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * StudentQueryService - Chuyên trách các truy vấn liên quan đến học viên.
 * Chỉ cho phép các thao tác Đọc (Read-only) dữ liệu.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentQueryService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final UserAccountRepository userAccountRepository;
    private final PlacementTestRepository placementTestRepository;
    private final CertificateRepository certificateRepository;

    /**
     * Lấy dữ liệu tổng hợp cho Student Dashboard dựa theo Username (an toàn tuyệt đối).
     */
    public StudentDashboardResponse getStudentDashboardByUsername(String username) {
        
        // 1. Phân giải Username -> Student ID (Tránh IDOR)
        var userAccount = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User account not found: " + username));
            
        Long studentId = userAccount.getUser().getId();

        // 2. Tận dụng logic lấy thông tin và ghi danh hiện có
        return getStudentDashboard(studentId);
    }

    /**
     * Lấy dữ liệu tổng hợp cho Student Dashboard theo ID.
     */
    public StudentDashboardResponse getStudentDashboard(Long studentId) {
        
        // 1. Lấy thông tin cơ bản của Student
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        // 2. Lấy danh sách ghi danh của học viên này (JOIN FETCH)
        List<Enrollment> enrollments = enrollmentRepository.findEnrollmentsByStudentId(studentId);

        // 3. Map sang Dashboard Response DTO
        return new StudentDashboardResponse(
            student.getId(),
            student.getFullName(),
            student.getEmail(),
            student.getPhone(),
            enrollments.stream().map(e -> new StudentDashboardResponse.EnrolledClassResponse(
                e.getClassEntity().getId(),
                e.getClassEntity().getClassCode(),
                e.getClassEntity().getCourse().getName(),
                e.getClassEntity().getStartDate(),
                e.getClassEntity().getEndDate(),
                e.getClassEntity().getStatus().name()
            )).collect(Collectors.toList())
        );
    }

    /**
     * Facade Method: Lấy toàn bộ hồ sơ chi tiết của Student theo Username.
     */
    public StudentProfileResponse getStudentProfileByUsername(String username) {
        var userAccount = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User account not found: " + username));
        
        Long studentId = userAccount.getUser().getId();
        return getStudentProfile(studentId);
    }

    /**
     * Core Method: Tổng hợp dữ liệu từ 3 Repository khác nhau để tạo StudentProfileResponse.
     */
    public StudentProfileResponse getStudentProfile(Long studentId) {
        // 1. Fetch Student (+ User via Joined Inheritance)
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found ID: " + studentId));

        // 2. Fetch Placement Tests
        List<PlacementTestDTO> placementTests = placementTestRepository.findByStudentId(studentId)
            .stream()
            .map(pt -> new PlacementTestDTO(
                pt.getTestDate(),
                pt.getListening(),
                pt.getSpeaking(),
                pt.getReading(),
                pt.getWriting(),
                pt.getOverall()
            ))
            .collect(Collectors.toList());

        // 3. Fetch Certificates
        List<CertificateDTO> certificates = certificateRepository.findByStudentId(studentId)
            .stream()
            .map(c -> new CertificateDTO(
                c.getName(),
                c.getIssueDate(),
                c.getCertificateUrl()
            ))
            .collect(Collectors.toList());

        // 4. Map and Aggregate Result
        return new StudentProfileResponse(
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getPhone(),
            student.getDateOfBirth(),
            student.getAvatarUrl(),
            student.getTargetScore(),
            student.getRegistrationDate(),
            placementTests,
            certificates
        );
    }
}
