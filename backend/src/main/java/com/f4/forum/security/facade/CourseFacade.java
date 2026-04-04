package com.f4.forum.security.facade;

import com.f4.forum.dto.CourseDTO;
import com.f4.forum.mapper.CourseMapper;
import com.f4.forum.service.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Facade Pattern: Điểm chạm duy nhất cho Module Course (Skill #3.4)
 * Giúp Controller không cần biết logic phức tạp bên trong các Service.
 */
@Service
public class CourseFacade {

    private final CourseService courseService;
    private final CourseMapper courseMapper;

    public CourseFacade(CourseService courseService, CourseMapper courseMapper) {
        this.courseService = courseService;
        this.courseMapper = courseMapper;
    }

    public List<CourseDTO> getAllCourses(String level, String keyword) {
        // Điều phối logic: Nếu có level thì lọc, có keyword thì tìm, không thì lấy hết
        if (level != null && !level.isBlank()) {
            return courseService.filterByLevel(level);
        }
        if (keyword != null && !keyword.isBlank()) {
            return courseService.searchByName(keyword);
        }
        return courseService.getAllCourses();
    }

    public CourseDTO getCourseById(Long id) {
        return courseService.getCourseById(id);
    }
}
