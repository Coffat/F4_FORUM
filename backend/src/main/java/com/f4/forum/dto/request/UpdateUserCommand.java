package com.f4.forum.dto.request;

import com.f4.forum.entity.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Command payload to update essential user info")
public record UpdateUserCommand(
    @NotBlank(message = "Tên không được để trống")
    @Schema(description = "Full name", example = "Trần Văn A")
    String fullName,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Schema(description = "Email", example = "tranvana@f4forum.com")
    String email,

    @Schema(description = "Phone", example = "0901234567")
    String phone,

    @NotNull(message = "Trạng thái không được để trống")
    @Schema(description = "Status (ACTIVE, INACTIVE, BANNED)", example = "ACTIVE")
    UserStatus status
) {}
