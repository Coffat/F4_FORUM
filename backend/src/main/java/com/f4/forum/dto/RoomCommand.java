package com.f4.forum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
@Schema(description = "Dữ liệu yêu cầu cho Phòng học (Room)")
public record RoomCommand(
    @NotBlank(message = "Tên phòng không được để trống")
    @Schema(description = "Tên phòng", example = "R01 - Theory")
    String name,

    @Positive(message = "Sức chứa phải là số dương")
    @Schema(description = "Sức chứa tối đa của phòng", example = "30")
    Integer capacity,

    @Schema(description = "Loại phòng (Lý thuyết, Thực hành, Seminar...)", example = "Theory")
    String roomType
) {}
