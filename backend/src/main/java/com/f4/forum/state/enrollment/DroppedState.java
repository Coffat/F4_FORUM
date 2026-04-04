package com.f4.forum.state.enrollment;

import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.enums.EnrollmentStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái ĐÃ HỦY của enrollment.
 */
@Slf4j
public class DroppedState implements EnrollmentState {

    @Override
    public void complete(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Không thể hoàn thành enrollment đã hủy!");
    }

    @Override
    public void drop(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Enrollment đã hủy trước đó!");
    }

    @Override
    public void suspend(Enrollment enrollment) {
        throw new BusinessRuleViolationException("Không thể suspend enrollment đã hủy!");
    }

    @Override
    public void activate(Enrollment enrollment) {
        log.info("Reactivate enrollment ID {}", enrollment.getId());
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
    }

    @Override
    public boolean canGrade() {
        return false;
    }

    @Override
    public String getStateName() {
        return "DROPPED";
    }
}
