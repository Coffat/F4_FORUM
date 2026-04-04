package com.f4.forum.repository;

import com.f4.forum.dto.response.ScheduleDTO;
import com.f4.forum.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
}
