package com.f4.forum.repository;

import com.f4.forum.entity.Submission;
import com.f4.forum.entity.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    @Query("SELECT s FROM Submission s JOIN FETCH s.assignment a WHERE s.student.id = :studentId AND a.classEntity.id = :classId")
    List<Submission> findByStudentIdAndClassIdWithAssignment(@Param("studentId") Long studentId, @Param("classId") Long classId);

    @Query("""
            SELECT COUNT(s)
            FROM Submission s
            JOIN s.assignment a
            WHERE a.teacher.id = :teacherId
              AND s.status = :status
              AND s.score IS NULL
            """)
    long countPendingByTeacher(
            @Param("teacherId") Long teacherId,
            @Param("status") SubmissionStatus status
    );
}
