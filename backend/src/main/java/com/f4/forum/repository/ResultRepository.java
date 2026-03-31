package com.f4.forum.repository;

import com.f4.forum.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    @Query("""
            SELECT r
            FROM Result r
            JOIN FETCH r.enrollment e
            WHERE e.id IN :enrollmentIds
            """)
    List<Result> findByEnrollmentIds(@Param("enrollmentIds") List<Long> enrollmentIds);
}

