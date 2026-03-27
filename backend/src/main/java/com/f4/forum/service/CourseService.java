package com.f4.forum.service;

import com.f4.forum.dto.CourseDTO;
import com.f4.forum.entity.Course;
import com.f4.forum.mapper.CourseMapper;
import com.f4.forum.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    public CourseService(CourseRepository courseRepository, CourseMapper courseMapper) {
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
    }

    /** Lấy toàn bộ khóa học */
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toDTO)
                .toList();
    }

    /** Lấy chi tiết 1 khóa học theo ID */
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khóa học với ID: " + id));
        return courseMapper.toDTO(course);
    }

    /** Tìm kiếm khóa học theo tên */
    public List<CourseDTO> searchByName(String keyword) {
        return courseRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(courseMapper::toDTO)
                .toList();
    }

    /** Lọc khóa học theo level */
    public List<CourseDTO> filterByLevel(String level) {
        return courseRepository.findByLevelIgnoreCase(level)
                .stream()
                .map(courseMapper::toDTO)
                .toList();
    }
}
