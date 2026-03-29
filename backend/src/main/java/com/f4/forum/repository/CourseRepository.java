package com.f4.forum.repository;

import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLevelIgnoreCase(String level);
    
    List<Course> findByNameContainingIgnoreCase(String keyword);
    
    @Query("SELECT c FROM Course c WHERE " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:category IS NULL OR c.category = :category)")
    Page<Course> findCoursesWithFilters(
            @Param("keyword") String keyword, 
            @Param("status") CourseStatus status, 
            @Param("category") String category, 
            Pageable pageable);
    
    long countByStatus(CourseStatus status);
    
    @Query("SELECT AVG(c.currentEnrollment) FROM Course c WHERE c.status = :status")
    Double getAverageEnrollment(@Param("status") CourseStatus status);
    
    @Query("SELECT SUM(c.fee * c.currentEnrollment) FROM Course c WHERE c.status = :status")
    BigDecimal getTotalRevenue(@Param("status") CourseStatus status);
}
