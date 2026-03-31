package com.f4.forum.state.enrollment;

import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.enums.EnrollmentStatus;
import org.springframework.stereotype.Component;

/**
 * ===== STATE PATTERN =====
 * Context class quản lý state transition cho Enrollment.
 */
@Component
public class EnrollmentStateContext {

    private static final EnrollmentState ACTIVE_STATE = new ActiveState();
    private static final EnrollmentState COMPLETED_STATE = new CompletedState();
    private static final EnrollmentState DROPPED_STATE = new DroppedState();

    public EnrollmentState getState(Enrollment enrollment) {
        return switch (enrollment.getStatus()) {
            case ENROLLED, SUSPENDED -> ACTIVE_STATE;
            case COMPLETED -> COMPLETED_STATE;
            case DROPPED -> DROPPED_STATE;
            default -> ACTIVE_STATE;
        };
    }

    public void complete(Enrollment enrollment) {
        getState(enrollment).complete(enrollment);
    }

    public void drop(Enrollment enrollment) {
        getState(enrollment).drop(enrollment);
    }

    public void suspend(Enrollment enrollment) {
        getState(enrollment).suspend(enrollment);
    }

    public void activate(Enrollment enrollment) {
        getState(enrollment).activate(enrollment);
    }

    public boolean canGrade(Enrollment enrollment) {
        return getState(enrollment).canGrade();
    }
}
