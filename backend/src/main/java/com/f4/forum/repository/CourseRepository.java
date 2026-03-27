package com.f4.forum.repository;

import com.f4.forum.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLevelIgnoreCase(String level);
    List<Course> findByNameContainingIgnoreCase(String keyword);
}
