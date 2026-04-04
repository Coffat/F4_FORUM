package com.f4.forum.service;

import com.f4.forum.dto.response.TeacherClassStudentResponse;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Facade cung cấp danh sách học viên trong lớp cho teacher.
 */
@Service
@Transactional(readOnly = true)
public class TeacherStudentFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;

    public TeacherStudentFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<TeacherClassStudentResponse> getClassStudents(Long classId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        List<Enrollment> enrollments = enrollmentRepository.findByClassIdWithStudent(classId);
        return enrollments.stream()
                .map(e -> new TeacherClassStudentResponse(
                        e.getId(),
                        e.getStudent().getId(),
                        e.getStudent().getFullName(),
                        e.getStudent().getEmail(),
                        e.getStudent().getPhone(),
                        e.getStatus().name()
                ))
                .toList();
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập danh sách học viên!");
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
}

