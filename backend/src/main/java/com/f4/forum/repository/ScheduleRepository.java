package com.f4.forum.repository;

import com.f4.forum.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

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
}

