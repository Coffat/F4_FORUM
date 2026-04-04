package com.f4.forum.event.teacher;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AssignmentCreatedEvent {
    private final Long assignmentId;
    private final Long classId;
    private final Long teacherId;
    private final String title;
}
