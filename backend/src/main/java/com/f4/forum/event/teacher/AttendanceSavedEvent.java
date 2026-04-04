package com.f4.forum.event.teacher;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AttendanceSavedEvent {
    private final Long scheduleId;
    private final Long classId;
    private final Long teacherId;
    private final int studentCount;
}
