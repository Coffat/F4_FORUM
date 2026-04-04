package com.f4.forum.event.teacher;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MaterialCreatedEvent {
    private final Long materialId;
    private final Long classId;
    private final Long teacherId;
    private final String title;
}
