package com.f4.forum.dto.request;

/**
 * Command cập nhật tài liệu từ Teacher Portal.
 */
public record UpdateTeacherMaterialCommand(
        String title,
        String description
) {}

