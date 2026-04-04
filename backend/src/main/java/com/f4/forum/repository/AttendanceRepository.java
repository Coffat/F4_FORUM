package com.f4.forum.repository;

import com.f4.forum.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEnrollmentId(Long enrollmentId);

    @Query("""
            SELECT a
            FROM Attendance a
            JOIN FETCH a.enrollment e
            JOIN FETCH e.student s
            WHERE a.schedule.id = :scheduleId
            """)
    List<Attendance> findByScheduleIdWithStudent(@Param("scheduleId") Long scheduleId);

    @Query("""
            SELECT a
            FROM Attendance a
            WHERE a.schedule.id = :scheduleId
              AND a.enrollment.id IN :enrollmentIds
            """)
    List<Attendance> findByScheduleIdAndEnrollmentIds(
            @Param("scheduleId") Long scheduleId,
            @Param("enrollmentIds") List<Long> enrollmentIds
    );

    @Query("SELECT a FROM Attendance a WHERE a.enrollment.classEntity.id = :classId")
    List<Attendance> findAllByClassId(@Param("classId") Long classId);
}
