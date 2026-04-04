package com.f4.forum.dto.response;

import java.time.LocalDate;

public record TeacherMaterialResponse(
        Long id,
        String title,
        String description,
        String fileUrl,
        LocalDate uploadDate
) {}

