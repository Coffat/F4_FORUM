package com.f4.forum.repository;

import com.f4.forum.entity.Submission;
import com.f4.forum.entity.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

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

