package com.f4.forum.state.course;

import com.f4.forum.entity.Course;

/**
 * ===== STATE PATTERN =====
 * Interface định nghĩa các hành vi của Course ở mỗi trạng thái.
 * Mỗi State class implement logic riêng cho trạng thái đó.
 */
public interface CourseState {
    
    /**
     * Xuất bản (publish) khóa học.
     */
    void publish(Course course);
    
    /**
     * Lưu trữ (archive) khóa học.
     */
    void archive(Course course);
    
    /**
     * Đóng khóa học.
     */
    void close(Course course);
    
    /**
     * Mở lại khóa học.
     */
    void reopen(Course course);
    
    /**
     * Kiểm tra khóa học có thể enroll students không.
     */
    boolean canEnroll();
    
    /**
     * Lấy tên trạng thái hiện tại.
     */
    String getStateName();
}
