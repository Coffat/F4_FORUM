package com.f4.forum.state.course;

import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái BẢN NHÁP của khóa học.
 * Course mới tạo sẽ ở trạng thái này.
 */
@Slf4j
public class DraftState implements CourseState {

    @Override
    public void publish(Course course) {
        log.info("Chuyển course {} từ DRAFT sang PUBLISHED", course.getCode());
        course.setStatus(CourseStatus.PUBLISHED);
    }

    @Override
    public void archive(Course course) {
        log.info("Chuyển course {} từ DRAFT sang ARCHIVED", course.getCode());
        course.setStatus(CourseStatus.ARCHIVED);
    }

    @Override
    public void close(Course course) {
        throw new BusinessRuleViolationException("Không thể đóng khóa học ở trạng thái bản nháp!");
    }

    @Override
    public void reopen(Course course) {
        throw new BusinessRuleViolationException("Khóa học đang ở trạng thái bản nháp, không cần mở lại!");
    }

    @Override
    public boolean canEnroll() {
        return false;
    }

    @Override
    public String getStateName() {
        return "DRAFT";
    }
}
