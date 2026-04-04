package com.f4.forum.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StudentAcademicResponse(
    List<PlacementTestDTO> placementTests,
    List<CertificateDTO> certificates,
    List<CourseResultRecord> courseResults 
) {
    public record CourseResultRecord(
        Long enrollmentId,
        String courseName,
        String classCode,
        AttendanceStats attendance,
        List<SubmissionRecord> assignmentScores,
        FinalResultRecord finalResult
    ) {}

    public record AttendanceStats(
        int totalSessions,
        int presentSessions,
        int absentSessions,
        double attendancePercentage
    ) {}

    public record SubmissionRecord(
        Long submissionId,
        String assignmentTitle,
        BigDecimal score,
        BigDecimal maxScore,
        String teacherComment,
        String status
    ) {}

    public record FinalResultRecord(
        BigDecimal midtermScore,
        BigDecimal finalScore,
        String grade,
        String teacherComment
    ) {}
}
