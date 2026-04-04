package com.f4.forum.state.course;

import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== STATE PATTERN =====
 * Trạng thái ĐÃ LƯU TRỮ của khóa học.
 * Course đã archive sẽ ở trạng thái này, không thể enroll.
 */
@Slf4j
public class ArchivedState implements CourseState {

    @Override
    public void publish(Course course) {
        log.info("Chuyển course {} từ ARCHIVED sang PUBLISHED", course.getCode());
        course.setStatus(CourseStatus.PUBLISHED);
    }

    @Override
    public void archive(Course course) {
        throw new BusinessRuleViolationException("Khóa học đã được lưu trữ trước đó!");
    }

    @Override
    public void close(Course course) {
        log.info("Chuyển course {} từ ARCHIVED sang CLOSED", course.getCode());
        course.setStatus(CourseStatus.CLOSED);
    }

    @Override
    public void reopen(Course course) {
        log.info("Chuyển course {} từ ARCHIVED sang PUBLISHED", course.getCode());
        course.setStatus(CourseStatus.PUBLISHED);
    }

    @Override
    public boolean canEnroll() {
        return false;
    }

    @Override
    public String getStateName() {
        return "ARCHIVED";
    }
}
