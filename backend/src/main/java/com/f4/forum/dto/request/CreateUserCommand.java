package com.f4.forum.dto.request;

import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.entity.enums.UserType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(description = "Command payload to create a new user (Student/Teacher/Staff)")
public record CreateUserCommand(
    @NotBlank(message = "Tên không được để trống")
    @Schema(description = "Full name", example = "Trần Văn A")
    String fullName,

    @NotBlank(message = "Username không được để trống")
    @Schema(description = "Username account", example = "tranvana")
    String username,

    @NotBlank(message = "Password không được để trống")
    @Schema(description = "Mật khẩu chưa hash", example = "123456")
    String rawPassword,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Schema(description = "Email", example = "tranvana@f4forum.com")
    String email,

    @Schema(description = "Phone", example = "0901234567")
    String phone,

    @NotNull(message = "Loại User không được để trống")
    @Schema(description = "User Type", example = "STUDENT")
    UserType userType,

    @NotNull(message = "Role không được để trống")
    @Schema(description = "Account Role", example = "ROLE_STUDENT")
    AccountRole role,
    
    // Properties for Student
    @Schema(description = "Date of birth (Student only)", example = "2000-01-01")
    LocalDate dateOfBirth,
    
    @Schema(description = "Gender (Student only)", example = "Nam")
    String gender,
    
    @Schema(description = "Address (Student only)", example = "123 ABC, TP.HCM")
    String address,
    
    // Properties for Teacher
    @Schema(description = "Specialty (Teacher only)", example = "IELTS 8.0")
    String specialty,
    
    @Schema(description = "Hire date (Teacher only)", example = "2023-01-15")
    LocalDate hireDate,
    
    // Properties for Staff
    @Schema(description = "Department (Staff only)", example = "IT")
    String department
) {}
