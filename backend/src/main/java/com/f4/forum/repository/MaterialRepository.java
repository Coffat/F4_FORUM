package com.f4.forum.repository;

import com.f4.forum.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("""
            SELECT m
            FROM Material m
            WHERE m.classEntity.id = :classId
            ORDER BY m.uploadDate DESC, m.id DESC
            """)
    List<Material> findByClassId(@Param("classId") Long classId);
}

