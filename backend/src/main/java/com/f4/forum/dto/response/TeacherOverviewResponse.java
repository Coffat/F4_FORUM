package com.f4.forum.dto.response;

/**
 * DTO tổng quan cho Teacher Profile cards:
 * - Lớp đang dạy
 * - Bài tập chờ chấm
 * - Buổi dạy trong tuần
 */
public record TeacherOverviewResponse(
        long activeClassesCount,
        long pendingSubmissionsCount,
        long weeklySessionsCount
) {}

