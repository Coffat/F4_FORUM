package com.f4.forum.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Command cập nhật bài tập từ Teacher Portal.
 */
public record UpdateTeacherAssignmentCommand(
        String title,
        String description,
        LocalDateTime dueDateTime,
        BigDecimal maxScore
) {}

