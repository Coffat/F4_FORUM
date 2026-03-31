package com.f4.forum.facade;

import com.f4.forum.dto.request.AddStudentToClassCommand;
import com.f4.forum.dto.response.AttendanceHistoryResponse;
import com.f4.forum.dto.response.AvailableStudentResponse;
import com.f4.forum.dto.response.ClassSummaryResponse;
import com.f4.forum.entity.Attendance;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.Student;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.exception.ResourceNotFoundException;
import com.f4.forum.repository.AttendanceRepository;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ===== FACADE PATTERN =====
 * Điểm truy cập duy nhất cho module Staff Class Management.
 * Che giấu sự phức tạp của việc phối hợp ClassRepository, StudentRepository,
 * EnrollmentRepository, AttendanceRepository đằng sau một interface gọn gàng.
 *
 * Controller chỉ cần gọi Facade này — không cần biết logic bên dưới.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffClassFacade {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // QUERY OPERATIONS (readOnly = true)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Lấy toàn bộ danh sách lớp học (không phân trang, dành cho Staff tổng quát).
     * Ánh xạ entity sang DTO để bảo vệ domain model.
     */
    public List<ClassSummaryResponse> getAllClasses() {
        List<ClassEntity> classes = classRepository.findAll();
        return classes.stream()
                .map(this::toClassSummary)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách sinh viên chưa đăng ký vào lớp học cụ thể.
     * Repository đã xử lý business rule "not enrolled".
     */
    public List<AvailableStudentResponse> getAvailableStudents(Long classId) {
        classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        List<Student> students = studentRepository.findAvailableStudents(classId);
        return students.stream()
                .map(s -> new AvailableStudentResponse(
                        s.getId(),
                        "STU-" + String.format("%04d", s.getId()),
                        s.getFullName(),
                        s.getEmail()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Lấy lịch sử điểm danh tổng hợp theo ngày cho một lớp học.
     * Group attendance records by schedule date, count present/absent per session.
     */
    public List<AttendanceHistoryResponse> getAttendanceHistory(Long classId) {
        classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        List<Attendance> attendances = attendanceRepository.findAllByClassId(classId);

        // Group by date (via schedule)
        Map<LocalDate, List<Attendance>> byDate = attendances.stream()
                .collect(Collectors.groupingBy(a -> a.getSchedule().getDate()));

        return byDate.entrySet().stream()
                .sorted(Map.Entry.<LocalDate, List<Attendance>>comparingByKey().reversed())
                .map(entry -> {
                    List<Attendance> sessionAttendances = entry.getValue();
                    long presentCount = sessionAttendances.stream()
                            .filter(a -> Boolean.TRUE.equals(a.getIsPresent()))
                            .count();
                    long absentCount = sessionAttendances.stream()
                            .filter(a -> Boolean.FALSE.equals(a.getIsPresent()))
                            .count();
                    return new AttendanceHistoryResponse(
                            entry.getKey(),
                            (int) presentCount,
                            (int) absentCount
                    );
                })
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COMMAND OPERATIONS (readOnly = false)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Thêm sinh viên vào lớp học.
     * Business Rules: class tồn tại, student tồn tại, chưa enrolled, lớp chưa đầy.
     */
    @Transactional
    public void addStudentToClass(Long classId, AddStudentToClassCommand command) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        Student student = studentRepository.findById(command.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + command.getStudentId()));

        // Business Rule: Không thêm trùng
        if (enrollmentRepository.existsByStudentIdAndClassEntityId(student.getId(), classId)) {
            throw new IllegalStateException("Student is already enrolled in this class.");
        }

        // Business Rule: Kiểm tra số lượng tối đa
        if (classEntity.getMaxStudents() != null) {
            long currentCount = enrollmentRepository.countByClassEntityId(classId);
            if (currentCount >= classEntity.getMaxStudents()) {
                throw new IllegalStateException(
                        "Class is already full (max: " + classEntity.getMaxStudents() + " students)."
                );
            }
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .classEntity(classEntity)
                .enrollmentDate(LocalDate.now())
                .status(EnrollmentStatus.ENROLLED)
                .build();

        enrollmentRepository.save(enrollment);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private ClassSummaryResponse toClassSummary(ClassEntity cls) {
        long enrollmentCount = enrollmentRepository.countByClassEntityId(cls.getId());
        String roomName = cls.getDefaultRoom() != null ? cls.getDefaultRoom().getName() : "Online";
        String courseName = cls.getCourse() != null ? cls.getCourse().getName() : "N/A";

        return new ClassSummaryResponse(
                cls.getId(),
                cls.getClassCode(),
                courseName,
                buildScheduleString(cls),
                roomName,
                (int) enrollmentCount,
                cls.getMaxStudents() != null ? cls.getMaxStudents() : 0,
                cls.getStatus()
        );
    }

    /**
     * Tạo chuỗi lịch học từ startDate/endDate của class.
     */
    private String buildScheduleString(ClassEntity cls) {
        if (cls.getStartDate() != null && cls.getEndDate() != null) {
            return cls.getStartDate() + " → " + cls.getEndDate();
        }
        if (cls.getStartDate() != null) {
            return "From " + cls.getStartDate();
        }
        return "TBD";
    }
}
