package com.f4.forum.dto.request;

import java.math.BigDecimal;
import java.util.List;

/**
 * Command lưu điểm theo danh sách học viên.
 */
public record UpdateTeacherGradesCommand(
        List<Entry> entries
) {
    public record Entry(
            Long enrollmentId,
            BigDecimal midtermScore,
            BigDecimal finalScore,
            String grade,
            String teacherComment
    ) {}
}

