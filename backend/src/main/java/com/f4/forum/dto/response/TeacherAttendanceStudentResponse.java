package com.f4.forum.dto.response;

public record TeacherAttendanceStudentResponse(
        Long enrollmentId,
        Long studentId,
        String studentName,
        String enrollmentStatus,
        boolean present,
        String note
) {}

