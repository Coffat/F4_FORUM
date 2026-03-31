package com.f4.forum.repository;

import com.f4.forum.entity.Enrollment;
import com.f4.forum.entity.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("""
            SELECT e.classEntity.id, COUNT(e)
            FROM Enrollment e
            WHERE e.classEntity.id IN :classIds
              AND e.status = :status
            GROUP BY e.classEntity.id
            """)
    List<Object[]> countActiveStudentsByClassIds(
            @Param("classIds") List<Long> classIds,
            @Param("status") EnrollmentStatus status
    );

    @Query("""
            SELECT e
            FROM Enrollment e
            JOIN FETCH e.student s
            WHERE e.classEntity.id = :classId
            ORDER BY s.fullName ASC
            """)
    List<Enrollment> findByClassIdWithStudent(@Param("classId") Long classId);

    @Query("""
            SELECT e
            FROM Enrollment e
            JOIN FETCH e.student s
            WHERE e.classEntity.id = :classId
              AND e.status = :status
            ORDER BY s.fullName ASC
            """)
    List<Enrollment> findByClassIdAndStatusWithStudent(
            @Param("classId") Long classId,
            @Param("status") EnrollmentStatus status
    );

    boolean existsByStudentIdAndClassEntityId(Long studentId, Long classEntityId);
    long countByClassEntityId(Long classEntityId);
    List<Enrollment> findByClassEntityId(Long classEntityId);
    
    @Query("SELECT e FROM Enrollment e JOIN FETCH e.classEntity c WHERE e.student.id = :studentId AND e.status = :status")
    List<Enrollment> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") EnrollmentStatus status);
}
