package com.f4.forum.service;

import com.f4.forum.dto.request.UpdateTeacherAttendanceCommand;
import com.f4.forum.dto.response.TeacherAttendanceSessionResponse;
import com.f4.forum.dto.response.TeacherAttendanceStudentResponse;
import com.f4.forum.entity.*;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.repository.AttendanceRepository;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TeacherAttendanceFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final ScheduleRepository scheduleRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;

    public TeacherAttendanceFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            ScheduleRepository scheduleRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.scheduleRepository = scheduleRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public List<TeacherAttendanceSessionResponse> getClassSessions(Long classId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        return scheduleRepository.findByClassId(classId).stream()
                .map(s -> new TeacherAttendanceSessionResponse(
                        s.getId(),
                        s.getDate(),
                        s.getStartTime(),
                        s.getEndTime()
                ))
                .toList();
    }

    public List<TeacherAttendanceStudentResponse> getAttendanceSheet(Long classId, Long scheduleId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);
        validateScheduleInClass(classId, scheduleId);

        List<Enrollment> enrollments = enrollmentRepository.findByClassIdAndStatusWithStudent(classId, EnrollmentStatus.ENROLLED);
        Map<Long, Attendance> attendanceByEnrollmentId = attendanceRepository.findByScheduleIdWithStudent(scheduleId).stream()
                .collect(Collectors.toMap(a -> a.getEnrollment().getId(), Function.identity(), (a, b) -> a));

        return enrollments.stream()
                .map(e -> {
                    Attendance attendance = attendanceByEnrollmentId.get(e.getId());
                    return new TeacherAttendanceStudentResponse(
                            e.getId(),
                            e.getStudent().getId(),
                            e.getStudent().getFullName(),
                            e.getStatus().name(),
                            attendance != null && Boolean.TRUE.equals(attendance.getIsPresent()),
                            attendance != null ? attendance.getNote() : null
                    );
                })
                .toList();
    }

    @Transactional
    public String saveAttendance(Long classId, Long scheduleId, String token, UpdateTeacherAttendanceCommand command) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);
        Schedule schedule = validateScheduleInClass(classId, scheduleId);

        if (command.entries() == null || command.entries().isEmpty()) {
            throw new RuntimeException("Danh sách điểm danh không được trống!");
        }

        List<Long> enrollmentIds = command.entries().stream()
                .map(UpdateTeacherAttendanceCommand.Entry::enrollmentId)
                .filter(Objects::nonNull)
                .toList();
        if (enrollmentIds.isEmpty()) {
            throw new RuntimeException("Danh sách enrollment không hợp lệ!");
        }

        Set<Long> validEnrollmentIds = enrollmentRepository.findByClassIdAndStatusWithStudent(classId, EnrollmentStatus.ENROLLED)
                .stream().map(Enrollment::getId).collect(Collectors.toSet());

        List<Attendance> existing = attendanceRepository.findByScheduleIdAndEnrollmentIds(scheduleId, enrollmentIds);
        Map<Long, Attendance> existingByEnrollmentId = existing.stream()
                .collect(Collectors.toMap(a -> a.getEnrollment().getId(), Function.identity(), (a, b) -> a));

        List<Attendance> toSave = new ArrayList<>();
        for (UpdateTeacherAttendanceCommand.Entry entry : command.entries()) {
            if (entry.enrollmentId() == null || !validEnrollmentIds.contains(entry.enrollmentId())) {
                continue;
            }
            boolean present = Boolean.TRUE.equals(entry.isPresent());
            String note = entry.note();

            Attendance attendance = existingByEnrollmentId.get(entry.enrollmentId());
            if (attendance == null) {
                Enrollment enrollmentRef = enrollmentRepository.findById(entry.enrollmentId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy enrollment: " + entry.enrollmentId()));
                attendance = Attendance.builder()
                        .schedule(schedule)
                        .enrollment(enrollmentRef)
                        .build();
            }

            if (present) {
                attendance.markPresent(note);
            } else {
                attendance.markAbsent(note);
            }
            toSave.add(attendance);
        }

        attendanceRepository.saveAll(toSave);
        return "Lưu điểm danh thành công!";
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập module điểm danh!");
        }
        return account.getUser().getId();
    }

    private void validateTeacherOwnsClass(Long teacherId, Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));
        boolean isOwner = classEntity.getTeachers().stream().anyMatch(t -> t.getId().equals(teacherId));
        if (!isOwner) {
            throw new RuntimeException("Bạn không có quyền thao tác lớp học này!");
        }
    }

    private Schedule validateScheduleInClass(Long classId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học!"));
        if (!Objects.equals(schedule.getClassEntity().getId(), classId)) {
            throw new RuntimeException("Buổi học không thuộc lớp đã chọn!");
        }
        return schedule;
    }
}

