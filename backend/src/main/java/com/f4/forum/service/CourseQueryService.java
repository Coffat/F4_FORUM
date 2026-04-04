package com.f4.forum.service;

import com.f4.forum.dto.response.CourseCatalogResponse;
import com.f4.forum.dto.response.CourseStatsResponse;
import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CourseQueryService {
    private final CourseRepository courseRepository;

    @Cacheable(value = "courses", key = "'catalog:' + #keyword + ':' + #status + ':' + #category", unless = "#result.isEmpty()")
    public Page<CourseCatalogResponse> getCourseCatalog(String keyword, CourseStatus status, String category, Pageable pageable) {
        log.debug("Fetching course catalog from DB with filters");
        Page<Course> courses = courseRepository.findCoursesWithFilters(keyword, status, category, pageable);
        return courses.map(this::mapToResponse);
    }

    @Cacheable(value = "courses", key = "#id", unless = "#result == null")
    public CourseCatalogResponse getCourseById(Long id) {
        log.debug("Fetching course from DB: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToResponse(course);
    }

    @Cacheable(value = "courses", key = "'stats'", unless = "#result == null")
    public CourseStatsResponse getCourseStats() {
        log.debug("Fetching course stats from DB");
        long totalActive = courseRepository.countByStatus(CourseStatus.PUBLISHED);
        Double avgEnrollment = courseRepository.getAverageEnrollment(CourseStatus.PUBLISHED);
        BigDecimal totalRevenue = courseRepository.getTotalRevenue(CourseStatus.PUBLISHED);

        return CourseStatsResponse.builder()
                .totalActiveCourses(totalActive)
                .newThisMonth(3) // Mock for visual parity for now
                .averageEnrollment(avgEnrollment != null ? avgEnrollment : 0.0)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .build();
    }

    private CourseCatalogResponse mapToResponse(Course c) {
        return CourseCatalogResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .category(c.getCategory())
                .currentEnrollment(c.getCurrentEnrollment() != null ? c.getCurrentEnrollment() : 0)
                .maxEnrollment(c.getMaxEnrollment() != null ? c.getMaxEnrollment() : 100)
                .fee(c.getFee())
                .status(c.getStatus())
                .imageUrl(c.getImageUrl())
                .imageColor(c.getImageColor())
                .level(c.getLevel())
                .build();
    }
}
