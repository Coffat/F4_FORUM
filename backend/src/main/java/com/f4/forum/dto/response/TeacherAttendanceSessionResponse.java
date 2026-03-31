package com.f4.forum.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record TeacherAttendanceSessionResponse(
        Long scheduleId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime
) {}

