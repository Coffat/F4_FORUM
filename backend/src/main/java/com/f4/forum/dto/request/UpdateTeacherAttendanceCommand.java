package com.f4.forum.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateTeacherAttendanceCommand(
    @NotNull(message = "Danh sách điểm danh không được để trống")
    @Valid
    List<Entry> entries
) {
    public record Entry(
        @NotNull(message = "Enrollment ID không được để trống")
        Long enrollmentId,
        Boolean isPresent,
        String remarks
    ) {}
}
