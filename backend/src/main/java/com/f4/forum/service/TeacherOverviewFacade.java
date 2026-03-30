package com.f4.forum.service;

import com.f4.forum.dto.response.TeacherOverviewResponse;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.entity.enums.SubmissionStatus;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.repository.SubmissionRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

/**
 * Facade tổng hợp metrics cho 3 card trong Teacher Profile.
 */
@Service
@Transactional(readOnly = true)
public class TeacherOverviewFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final SubmissionRepository submissionRepository;
    private final ScheduleRepository scheduleRepository;

    public TeacherOverviewFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            SubmissionRepository submissionRepository,
            ScheduleRepository scheduleRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.submissionRepository = submissionRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public TeacherOverviewResponse getMyOverview(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);

        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập dashboard giảng viên!");
        }

        Long teacherId = account.getUser().getId();

        List<ClassStatus> activeStatuses = List.of(ClassStatus.OPEN, ClassStatus.IN_PROGRESS);
        long activeClassesCount = classRepository.countActiveClassesByTeacher(teacherId, activeStatuses);

        long pendingSubmissionsCount = submissionRepository.countPendingByTeacher(teacherId, SubmissionStatus.SUBMITTED);

        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        long weeklySessionsCount = scheduleRepository.countWeeklySessionsByTeacher(teacherId, startOfWeek, endOfWeek);

        return new TeacherOverviewResponse(activeClassesCount, pendingSubmissionsCount, weeklySessionsCount);
    }
}

