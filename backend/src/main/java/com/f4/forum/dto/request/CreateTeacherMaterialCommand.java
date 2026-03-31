package com.f4.forum.dto.request;

/**
 * Command tạo tài liệu cho lớp từ Teacher Portal.
 */
public record CreateTeacherMaterialCommand(
        String title,
        String description
) {}

