package com.f4.forum.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Command tạo bài tập từ Teacher Portal.
 */
public record CreateTeacherAssignmentCommand(
        String title,
        String description,
        LocalDateTime dueDateTime,
        BigDecimal maxScore
) {}

