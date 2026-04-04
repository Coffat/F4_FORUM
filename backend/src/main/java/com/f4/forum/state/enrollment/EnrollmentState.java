package com.f4.forum.state.enrollment;

import com.f4.forum.entity.Enrollment;

/**
 * ===== STATE PATTERN =====
 * Interface định nghĩa các hành vi của Enrollment ở mỗi trạng thái.
 */
public interface EnrollmentState {
    
    /**
     * Hoàn thành khóa học.
     */
    void complete(Enrollment enrollment);
    
    /**
     * Hủy đăng ký.
     */
    void drop(Enrollment enrollment);
    
    /**
     * Đóng băng (suspend) enrollment.
     */
    void suspend(Enrollment enrollment);
    
    /**
     * Kích hoạt lại.
     */
    void activate(Enrollment enrollment);
    
    /**
     * Kiểm tra có thể chấm điểm không.
     */
    boolean canGrade();
    
    /**
     * Lấy tên trạng thái.
     */
    String getStateName();
}
