package com.f4.forum.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record TeacherScheduleEventResponse(
        Long scheduleId,
        Long classId,
        String classCode,
        String courseName,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String roomName,
        String branchName,
        Boolean online,
        String meetingLink
) {}

