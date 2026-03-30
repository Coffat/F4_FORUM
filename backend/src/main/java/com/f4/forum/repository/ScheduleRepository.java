package com.f4.forum.repository;

import com.f4.forum.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("""
            SELECT COUNT(s)
            FROM Schedule s
            JOIN s.classEntity c
            JOIN c.teachers t
            WHERE t.id = :teacherId
              AND s.date BETWEEN :startDate AND :endDate
            """)
    long countWeeklySessionsByTeacher(
            @Param("teacherId") Long teacherId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT s
            FROM Schedule s
            WHERE s.classEntity.id = :classId
            ORDER BY s.date DESC, s.startTime DESC
            """)
    java.util.List<Schedule> findByClassId(@Param("classId") Long classId);

    @Query("""
            SELECT s
            FROM Schedule s
            JOIN FETCH s.classEntity c
            JOIN c.teachers t
            LEFT JOIN FETCH c.course
            LEFT JOIN FETCH s.room
            WHERE t.id = :teacherId
              AND s.date BETWEEN :fromDate AND :toDate
            ORDER BY s.date ASC, s.startTime ASC
            """)
    List<Schedule> findByTeacherIdAndDateBetween(
            @Param("teacherId") Long teacherId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}

