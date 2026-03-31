package com.f4.forum.service;

import com.f4.forum.dto.request.CreateCourseCommand;
import com.f4.forum.entity.Course;
import com.f4.forum.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseCommandService {
    private final CourseRepository courseRepository;

    public Long createCourse(CreateCourseCommand command) {
        Course course = Course.builder()
                .code(command.getCode())
                .name(command.getName())
                .description(command.getDescription())
                .category(command.getCategory())
                .level(command.getLevel())
                .fee(command.getFee())
                .status(command.getStatus())
                .maxEnrollment(command.getMaxEnrollment() != null ? command.getMaxEnrollment() : 100)
                .currentEnrollment(0)
                .imageUrl(command.getImageUrl())
                .imageColor(command.getImageColor())
                .build();
                
        return courseRepository.save(course).getId();
    }

    public void updateCourse(Long id, com.f4.forum.dto.request.UpdateCourseCommand command) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.updateDetails(
                command.getName(),
                command.getDescription(),
                command.getCategory(),
                command.getLevel(),
                command.getFee(),
                command.getMaxEnrollment() != null ? command.getMaxEnrollment() : 100,
                command.getImageUrl(),
                command.getImageColor(),
                command.getStatus()
        );
        courseRepository.save(course);
    }

    public void archiveCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.archive();
        courseRepository.save(course);
    }

    public void updateCourseByStaff(Long id, com.f4.forum.dto.request.UpdateStaffCourseCommand command) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.updateDetailsByStaff(
                command.getName(),
                command.getDescription(),
                command.getCategory(),
                command.getLevel(),
                command.getMaxEnrollment() != null ? command.getMaxEnrollment() : 100,
                command.getImageUrl(),
                command.getImageColor(),
                command.getStatus()
        );
        courseRepository.save(course);
    }
}
