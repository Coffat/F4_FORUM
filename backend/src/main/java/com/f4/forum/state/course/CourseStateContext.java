package com.f4.forum.state.course;

import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import org.springframework.stereotype.Component;

/**
 * ===== STATE PATTERN =====
 * Context class quản lý state transition cho Course.
 * Delegate các hành vi sang state object hiện tại.
 */
@Component
public class CourseStateContext {

    private static final CourseState DRAFT_STATE = new DraftState();
    private static final CourseState PUBLISHED_STATE = new PublishedState();
    private static final CourseState ARCHIVED_STATE = new ArchivedState();

    /**
     * Lấy state object tương ứng với CourseStatus.
     */
    public CourseState getState(Course course) {
        return switch (course.getStatus()) {
            case DRAFT -> DRAFT_STATE;
            case PUBLISHED -> PUBLISHED_STATE;
            case ARCHIVED -> ARCHIVED_STATE;
            default -> DRAFT_STATE;
        };
    }

    /**
     * Chuyển sang trạng thái Published.
     */
    public void publish(Course course) {
        getState(course).publish(course);
    }

    /**
     * Chuyển sang trạng thái Archived.
     */
    public void archive(Course course) {
        getState(course).archive(course);
    }

    /**
     * Chuyển sang trạng thái Closed.
     */
    public void close(Course course) {
        getState(course).close(course);
    }

    /**
     * Mở lại khóa học.
     */
    public void reopen(Course course) {
        getState(course).reopen(course);
    }

    /**
     * Kiểm tra có thể enroll không.
     */
    public boolean canEnroll(Course course) {
        return getState(course).canEnroll();
    }

    /**
     * Lấy tên trạng thái hiện tại.
     */
    public String getStateName(Course course) {
        return getState(course).getStateName();
    }
}
