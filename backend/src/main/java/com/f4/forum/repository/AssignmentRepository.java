package com.f4.forum.repository;

import com.f4.forum.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @Query("""
            SELECT a
            FROM Assignment a
            WHERE a.classEntity.id = :classId
              AND a.teacher.id = :teacherId
            ORDER BY a.dueDate DESC, a.id DESC
            """)
    List<Assignment> findByClassIdAndTeacherId(
            @Param("classId") Long classId,
            @Param("teacherId") Long teacherId
    );
}

