package com.f4.forum.state.course;

import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái ĐÃ XUẤT BẢN của khóa học.
 * Course đã publish sẽ ở trạng thái này, có thể enroll students.
 */
@Slf4j
public class PublishedState implements CourseState {

    @Override
    public void publish(Course course) {
        throw new BusinessRuleViolationException("Khóa học đã được xuất bản trước đó!");
    }

    @Override
    public void archive(Course course) {
        log.info("Chuyển course {} từ PUBLISHED sang ARCHIVED", course.getCode());
        course.setStatus(CourseStatus.ARCHIVED);
    }

    @Override
    public void close(Course course) {
        log.info("Chuyển course {} từ PUBLISHED sang CLOSED", course.getCode());
        course.setStatus(CourseStatus.CLOSED);
    }

    @Override
    public void reopen(Course course) {
        throw new BusinessRuleViolationException("Khóa học đang hoạt động, không cần mở lại!");
    }

    @Override
    public boolean canEnroll() {
        return true;
    }

    @Override
    public String getStateName() {
        return "PUBLISHED";
    }
}
