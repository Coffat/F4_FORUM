package com.f4.forum.state.enrollment;

import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái HOÀN THÀNH của enrollment.
 */
@Slf4j
public class CompletedState implements EnrollmentState {

    @Override
    public void complete(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Enrollment đã hoàn thành trước đó!");
    }

    @Override
    public void drop(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Không thể hủy enrollment đã hoàn thành!");
    }

    @Override
    public void suspend(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Không thể suspend enrollment đã hoàn thành!");
    }

    @Override
    public void activate(Enrollment enrollment) {
        log.info("Reopen enrollment ID {}", enrollment.getId());
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
    }

    @Override
    public boolean canGrade() {
        return true;
    }

    @Override
    public String getStateName() {
        return "COMPLETED";
    }
}
