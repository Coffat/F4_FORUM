package com.f4.forum.dto.request;

import java.util.List;

/**
 * Command cập nhật điểm danh cho 1 buổi học.
 */
public record UpdateTeacherAttendanceCommand(
        List<Entry> entries
) {
    public record Entry(
            Long enrollmentId,
            Boolean isPresent,
            String remarks
    ) {}
}

