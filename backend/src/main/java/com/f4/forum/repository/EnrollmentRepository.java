package com.f4.forum.repository;

import com.f4.forum.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Lấy danh sách ghi danh của học viên kèm theo Class và Course.
     * Sử dụng JOIN FETCH để tránh lỗi N+1 Query.
     */
    @Query("SELECT e FROM Enrollment e " +
           "JOIN FETCH e.classEntity c " +
           "JOIN FETCH c.course " +
           "WHERE e.student.id = :studentId")
    List<Enrollment> findEnrollmentsByStudentId(@Param("studentId") Long studentId);
}
