package com.f4.forum.mapper;

import com.f4.forum.dto.CourseDTO;
import com.f4.forum.entity.Course;
import org.springframework.stereotype.Component;

/**
 * Mapper chuyển đổi giữa Entity và DTO - Đảm bảo tính đóng gói (Clean Architecture)
 */
@Component
public class CourseMapper {

    public CourseDTO toDTO(Course course) {
        if (course == null) return null;
        
        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDescription(),
                course.getLevel(),
                course.getFee()
        );
    }
}
