package com.f4.forum.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO trả về thông tin hồ sơ giảng viên cho Teacher Portal.
 */
public record TeacherProfileResponse(
        String username,
        String role,
        String fullName,
        String email,
        String phone,
        String specialty,
        LocalDate hireDate,
        LocalDateTime lastLogin
) {}

