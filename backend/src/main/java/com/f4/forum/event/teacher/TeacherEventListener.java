package com.f4.forum.event.teacher;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TeacherEventListener {

    @Async
    @EventListener
    public void handleAssignmentCreated(AssignmentCreatedEvent event) {
        log.info("📝 [Teacher Event] Assignment created: '{}' (ID: {}) in class {} by teacher {}",
                event.getTitle(), event.getAssignmentId(), event.getClassId(), event.getTeacherId());
    }

    @Async
    @EventListener
    public void handleAssignmentUpdated(AssignmentUpdatedEvent event) {
        log.info("✏️ [Teacher Event] Assignment updated: '{}' (ID: {}) in class {} by teacher {}",
                event.getTitle(), event.getAssignmentId(), event.getClassId(), event.getTeacherId());
    }

    @Async
    @EventListener
    public void handleAssignmentDeleted(AssignmentDeletedEvent event) {
        log.info("🗑️ [Teacher Event] Assignment deleted: ID {} in class {} by teacher {}",
                event.getAssignmentId(), event.getClassId(), event.getTeacherId());
    }


    @Async
    @EventListener
    public void handleAttendanceSaved(AttendanceSavedEvent event) {
        log.info("📋 [Teacher Event] Attendance saved for schedule {} in class {} by teacher {}, {} students",
                event.getScheduleId(), event.getClassId(), event.getTeacherId(), event.getStudentCount());
    }

    @Async
    @EventListener
    public void handleGradeUpdated(GradeUpdatedEvent event) {
        log.info("📊 [Teacher Event] Grades updated for class {} by teacher {}, {} students",
                event.getClassId(), event.getTeacherId(), event.getStudentCount());
    }
}
