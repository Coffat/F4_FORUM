package com.f4.forum.repository;

import com.f4.forum.dto.response.ScheduleDTO;
import com.f4.forum.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * ScheduleRepository - Quản lý truy xuất dữ liệu buổi học.
 * Sử dụng JPQL và DTO Projection để giải quyết triệt để bài toán N+1.
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    /**
     * Truy xuất lịch học của học viên theo tuần bằng một câu Query duy nhất.
     * Sử dụng JOIN FETCH ngầm qua Constructor Expression.
     * Tránh tải Entity nặng, chỉ lấy các trường cần thiết cho UI.
     */
    @Query("""
        SELECT new com.f4.forum.dto.response.ScheduleDTO(
            s.id, 
            s.date, 
            s.startTime, 
            s.endTime, 
            s.isOnline, 
            s.meetingLink,
            c.classCode, 
            cr.name, 
            cr.imageColor, 
            COALESCE(r.name, 'Online/N/A'), 
            COALESCE(a.isPresent, false)
        )
        FROM Schedule s
        JOIN s.classEntity c
        JOIN c.course cr
        LEFT JOIN s.room r
        JOIN Enrollment e ON e.classEntity.id = c.id
        LEFT JOIN Attendance a ON a.schedule.id = s.id AND a.enrollment.id = e.id
        WHERE e.student.id = :studentId
          AND s.date BETWEEN :startDate AND :endDate
        ORDER BY s.date ASC, s.startTime ASC
    """)
    List<ScheduleDTO> findWeeklySchedulesByStudentId(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

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
    List<Schedule> findByClassId(@Param("classId") Long classId);

    @Query("""
            SELECT s
            FROM Schedule s
            JOIN FETCH s.classEntity c
            JOIN c.teachers t
            LEFT JOIN FETCH c.course
            LEFT JOIN FETCH s.room r
            WHERE t.id = :teacherId
              AND s.date BETWEEN :fromDate AND :toDate
            ORDER BY s.date ASC, s.startTime ASC
            """)
    List<Schedule> findByTeacherIdAndDateBetween(
            @Param("teacherId") Long teacherId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    /**
     * Checks if there's any given schedule overlapping with the given time in the same room.
     */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Schedule s WHERE s.room.id = :roomId " +
           "AND s.date = :date " +
           "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    boolean existsConflictingSchedule(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    /**
     * Checks if there's any given schedule overlapping with the given time in the same room, excluding an existing schedule.
     */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Schedule s WHERE s.room.id = :roomId " +
           "AND s.date = :date " +
           "AND ((s.startTime < :endTime AND s.endTime > :startTime)) " +
           "AND s.id != :excludedId")
    boolean existsConflictingScheduleExcludingId(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludedId") Long excludedId);

    List<Schedule> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
