package com.f4.forum.repository;

import com.f4.forum.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    @Query("SELECT s FROM Submission s JOIN FETCH s.assignment a WHERE s.student.id = :studentId AND a.classEntity.id = :classId")
    List<Submission> findByStudentIdAndClassIdWithAssignment(@Param("studentId") Long studentId, @Param("classId") Long classId);
}
