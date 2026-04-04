package com.f4.forum.event.course;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CourseCreatedEvent {
    private final Long courseId;
    private final String courseName;
    private final String courseCode;
}
