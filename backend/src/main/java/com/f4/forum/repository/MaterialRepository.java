package com.f4.forum.repository;

import com.f4.forum.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("""
            SELECT m
            FROM Material m
            WHERE m.classEntity.id = :classId
            ORDER BY m.uploadDate DESC, m.id DESC
            """)
    List<Material> findByClassId(@Param("classId") Long classId);

    @Query("""
            SELECT m
            FROM Material m
            WHERE m.id = :materialId
              AND m.classEntity.id = :classId
            """)
    Optional<Material> findByIdAndClassId(
            @Param("materialId") Long materialId,
            @Param("classId") Long classId
    );

    List<Material> findByCourseId(Long courseId);
}
