package com.f4.forum.dto.response;

/**
 * DTO tóm tắt mỗi lớp trong tab "Lớp" của Teacher Portal.
 */
public record TeacherClassSummaryResponse(
        Long classId,
        String classCode,
        String courseName,
        String status,
        long activeStudents,
        long weeklySessions
) {}

