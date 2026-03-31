package com.f4.forum.dto.response;

import java.time.LocalDateTime;

/**
 * DTO hiển thị bài tập trong màn chi tiết lớp của giảng viên.
 */
public record TeacherAssignmentResponse(
        Long id,
        String title,
        String description,
        String attachmentUrl,
        LocalDateTime dueDate
) {}

