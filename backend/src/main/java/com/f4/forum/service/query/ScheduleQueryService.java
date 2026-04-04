package com.f4.forum.service.query;

import com.f4.forum.dto.response.ScheduleDTO;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * ScheduleQueryService - Chuyên trách truy vấn lịch học.
 * Sử dụng Virtual Threads qua @Async (Spring Boot 3.4) để tối ưu hóa I/O throughput.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ScheduleQueryService {

    private final ScheduleRepository scheduleRepository;
    private final UserAccountRepository userAccountRepository;

    /**
     * Lấy lịch học theo tuần dựa trên Username.
     * Tự động điều phối sang Virtual Thread nhờ cấu hình Async của dự án.
     */
    @Async
    public CompletableFuture<List<ScheduleDTO>> getWeeklySchedulesByUsername(
            String username, 
            LocalDate startDate, 
            LocalDate endDate
    ) {
        log.info("Fetching weekly schedules for user: {} from {} to {} [Thread: {}]", 
            username, startDate, endDate, Thread.currentThread());

        // 1. Phân giải danh tính (Anti-IDOR)
        var userAccount = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản: " + username));
        
        Long studentId = userAccount.getUser().getId();

        // 2. Truy vấn dữ liệu qua Repository (DTO Projection)
        List<ScheduleDTO> schedules = scheduleRepository.findWeeklySchedulesByStudentId(
            studentId, startDate, endDate
        );

        return CompletableFuture.completedFuture(schedules);
    }
}
