package com.f4.forum.dto.response;

/**
 * DTO hiển thị học viên trong một lớp của teacher.
 */
public record TeacherClassStudentResponse(
        Long enrollmentId,
        Long studentId,
        String fullName,
        String email,
        String phone,
        String enrollmentStatus
) {}

