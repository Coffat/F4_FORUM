package com.f4.forum.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateTeacherAttendanceCommand(
        @NotNull(message = "Danh sách điểm danh không được để trống") @Valid List<Entry> entries) {
    public record Entry(
            Long enrollmentId,
            Boolean isPresent,
            String note) {
    }
}
