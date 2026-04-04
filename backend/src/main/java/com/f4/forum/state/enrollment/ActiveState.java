package com.f4.forum.state.enrollment;

import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.enums.EnrollmentStatus;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái HOẠT ĐỘNG của enrollment.
 */
@Slf4j
public class ActiveState implements EnrollmentState {

    @Override
    public void complete(Enrollment enrollment) {
        log.info("Complete enrollment ID {}", enrollment.getId());
        enrollment.setStatus(EnrollmentStatus.COMPLETED);
    }

    @Override
    public void drop(Enrollment enrollment) {
        log.info("Drop enrollment ID {}", enrollment.getId());
        enrollment.setStatus(EnrollmentStatus.DROPPED);
    }

    @Override
    public void suspend(Enrollment enrollment) {
        log.info("Suspend enrollment ID {}", enrollment.getId());
        enrollment.setStatus(EnrollmentStatus.SUSPENDED);
    }

    @Override
    public void activate(Enrollment enrollment) {
        log.info("Enrollment ID {} đã ở trạng thái active", enrollment.getId());
    }

    @Override
    public boolean canGrade() {
        return true;
    }

    @Override
    public String getStateName() {
        return "ACTIVE";
    }
}
