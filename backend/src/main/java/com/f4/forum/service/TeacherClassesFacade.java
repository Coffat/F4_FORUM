package com.f4.forum.service;

import com.f4.forum.dto.response.TeacherClassSummaryResponse;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.EnrollmentRepository;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Facade: cung cấp danh sách lớp cho tab "Lớp" của Teacher Portal.
 */
@Service
@Transactional(readOnly = true)
public class TeacherClassesFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ScheduleRepository scheduleRepository;

    public TeacherClassesFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            ScheduleRepository scheduleRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<TeacherClassSummaryResponse> getMyClasses(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);

        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập danh sách lớp giảng viên!");
        }

        Long teacherId = account.getUser().getId();

        // 1. Lấy tất cả lớp mà teacher đang dạy
        List<ClassStatus> statuses = List.of(ClassStatus.OPEN, ClassStatus.IN_PROGRESS, ClassStatus.CLOSED);
        List<ClassEntity> classes = classRepository.findAll().stream()
                .filter(c -> c.getTeachers().stream().anyMatch(t -> Objects.equals(t.getId(), teacherId)))
                .filter(c -> statuses.contains(c.getStatus()))
                .collect(Collectors.toList());

        if (classes.isEmpty()) {
            return List.of();
        }

        List<Long> classIds = classes.stream().map(ClassEntity::getId).toList();

        // 2. Đếm số học viên ACTIVE cho từng lớp (grouped query)
        Map<Long, Long> activeStudentsByClass = new HashMap<>();
        enrollmentRepository.countActiveStudentsByClassIds(classIds, EnrollmentStatus.ENROLLED)
                .forEach(row -> {
                    Long classId = (Long) row[0];
                    Long count = (Long) row[1];
                    activeStudentsByClass.put(classId, count);
                });

        // 3. Đếm số buổi trong tuần cho từng lớp
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        Map<Long, Long> weeklySessionsByClass = new HashMap<>();
        for (Long classId : classIds) {
            long count = scheduleRepository.countWeeklySessionsByTeacher(teacherId, startOfWeek, endOfWeek);
            weeklySessionsByClass.put(classId, count);
        }

        // 4. Map sang DTO
        return classes.stream()
                .map(c -> new TeacherClassSummaryResponse(
                        c.getId(),
                        c.getClassCode(),
                        c.getCourse().getName(),
                        c.getStatus().name(),
                        activeStudentsByClass.getOrDefault(c.getId(), 0L),
                        weeklySessionsByClass.getOrDefault(c.getId(), 0L)
                ))
                .toList();
    }
}

