package com.f4.forum.dto.command;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Command Record: Dùng cho tiến trình cập nhật Hồ sơ Học viên.
 * Áp dụng Java Bean Validation để lọc dữ liệu ngay tại cửa ngõ API.
 */
public record UpdateStudentProfileCommand(
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại không hợp lệ")
    String phoneNumber,

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là một ngày trong quá khứ")
    LocalDate dateOfBirth,

    String avatarUrl,

    @NotNull(message = "Điểm mục tiêu không được để trống")
    BigDecimal targetScore,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    String email
) {
}
