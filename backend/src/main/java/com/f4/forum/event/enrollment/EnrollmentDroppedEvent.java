package com.f4.forum.event.enrollment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class EnrollmentDroppedEvent {
    private final Long enrollmentId;
    private final Long studentId;
    private final Long classId;
    private final String reason;
}
