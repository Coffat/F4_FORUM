package com.f4.forum.service;

import com.f4.forum.dto.request.UpdateTeacherGradesCommand;
import com.f4.forum.dto.response.TeacherGradeStudentResponse;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.Result;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.ResultRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TeacherGradesFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ResultRepository resultRepository;

    public TeacherGradesFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            ResultRepository resultRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.resultRepository = resultRepository;
    }

    public List<TeacherGradeStudentResponse> getGradesSheet(Long classId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        List<Enrollment> enrollments = enrollmentRepository.findByClassIdAndStatusWithStudent(classId, EnrollmentStatus.ENROLLED);
        List<Long> enrollmentIds = enrollments.stream().map(Enrollment::getId).toList();
        Map<Long, Result> resultByEnrollment = resultRepository.findByEnrollmentIds(enrollmentIds).stream()
                .collect(Collectors.toMap(r -> r.getEnrollment().getId(), Function.identity(), (a, b) -> a));

        return enrollments.stream().map(e -> {
            Result result = resultByEnrollment.get(e.getId());
            return new TeacherGradeStudentResponse(
                    e.getId(),
                    e.getStudent().getId(),
                    e.getStudent().getFullName(),
                    result != null ? result.getMidtermScore() : null,
                    result != null ? result.getFinalScore() : null,
                    result != null ? result.getGrade() : null,
                    result != null ? result.getTeacherComment() : null
            );
        }).toList();
    }

    @Transactional
    public String saveGrades(Long classId, String token, UpdateTeacherGradesCommand command) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        if (command.entries() == null || command.entries().isEmpty()) {
            throw new RuntimeException("Danh sách điểm không được trống!");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByClassIdAndStatusWithStudent(classId, EnrollmentStatus.ENROLLED);
        Map<Long, Enrollment> enrollmentMap = enrollments.stream()
                .collect(Collectors.toMap(Enrollment::getId, Function.identity()));
        List<Long> enrollmentIds = new ArrayList<>(enrollmentMap.keySet());
        Map<Long, Result> resultByEnrollment = resultRepository.findByEnrollmentIds(enrollmentIds).stream()
                .collect(Collectors.toMap(r -> r.getEnrollment().getId(), Function.identity(), (a, b) -> a));

        List<Result> toSave = new ArrayList<>();
        for (UpdateTeacherGradesCommand.Entry entry : command.entries()) {
            if (entry.enrollmentId() == null || !enrollmentMap.containsKey(entry.enrollmentId())) continue;

            BigDecimal mid = entry.midtermScore();
            BigDecimal fin = entry.finalScore();
            validateScore(mid);
            validateScore(fin);

            Result result = resultByEnrollment.get(entry.enrollmentId());
            if (result == null) {
                result = Result.builder()
                        .enrollment(enrollmentMap.get(entry.enrollmentId()))
                        .build();
            }
            result.updateScores(mid, fin, nullable(entry.grade()), nullable(entry.teacherComment()));
            toSave.add(result);
        }

        resultRepository.saveAll(toSave);
        return "Lưu điểm thành công!";
    }

    private static String nullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static void validateScore(BigDecimal score) {
        if (score == null) return;
        if (score.compareTo(BigDecimal.ZERO) < 0 || score.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Điểm phải nằm trong khoảng 0-100!");
        }
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập module nhập điểm!");
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

