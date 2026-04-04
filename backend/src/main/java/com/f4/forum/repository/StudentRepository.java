package com.f4.forum.repository;

import com.f4.forum.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.classEntity.id = :classId)")
    List<Student> findAvailableStudents(@Param("classId") Long classId);
    
    @Query("SELECT s FROM Student s WHERE LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR s.phone LIKE CONCAT('%', :keyword, '%')")
    List<Student> searchStudents(@Param("keyword") String keyword);
}
