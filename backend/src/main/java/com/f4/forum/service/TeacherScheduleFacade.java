package com.f4.forum.service;

import com.f4.forum.dto.response.TeacherScheduleEventResponse;
import com.f4.forum.entity.Schedule;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherScheduleFacade {

    private final UserAccountRepository userAccountRepository;
    private final ScheduleRepository scheduleRepository;

    public TeacherScheduleFacade(
            UserAccountRepository userAccountRepository,
            ScheduleRepository scheduleRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<TeacherScheduleEventResponse> getMySchedule(String token, LocalDate fromDate, LocalDate toDate) {
        Long teacherId = resolveTeacherIdFromToken(token);
        return scheduleRepository.findByTeacherIdAndDateBetween(teacherId, fromDate, toDate).stream()
                .map(this::toResponse)
                .toList();
    }

    private TeacherScheduleEventResponse toResponse(Schedule s) {
        return new TeacherScheduleEventResponse(
                s.getId(),
                s.getClassEntity().getId(),
                s.getClassEntity().getClassCode(),
                s.getClassEntity().getCourse().getName(),
                s.getDate(),
                s.getStartTime(),
                s.getEndTime(),
                s.getRoom() != null ? s.getRoom().getName() : null,
                Boolean.TRUE.equals(s.getIsOnline()),
                s.getMeetingLink()
        );
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập lịch dạy!");
        }
        return account.getUser().getId();
    }
}

