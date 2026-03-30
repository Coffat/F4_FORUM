package com.f4.forum.dto.response;

import java.math.BigDecimal;

public record TeacherGradeStudentResponse(
        Long enrollmentId,
        Long studentId,
        String studentName,
        BigDecimal midtermScore,
        BigDecimal finalScore,
        String grade,
        String teacherComment
) {}

