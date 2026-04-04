package com.f4.forum.repository;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.enums.ClassStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    /**
     * Chức năng cũ: Fetch toàn bộ danh sách lớp học
     */
    @EntityGraph(attributePaths = {"course", "defaultRoom"})
    @Query("SELECT c FROM ClassEntity c")
    List<ClassEntity> findClassesWithDetails();

    /**
     * Chức năng mới: Phân trang + Tìm kiếm theo Search & Filter
     */
    @EntityGraph(attributePaths = {"course", "defaultRoom"})
    @Query("SELECT c FROM ClassEntity c WHERE " +
           "(:classCode IS NULL OR LOWER(c.classCode) LIKE LOWER(CONCAT('%', :classCode, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<ClassEntity> findClassesWithFilters(
            @Param("classCode") String classCode, 
            @Param("status") ClassStatus status, 
            Pageable pageable);

    @Query("SELECT c FROM ClassEntity c WHERE (:statuses IS NULL OR c.status IN :statuses)")
    Page<ClassEntity> findAllByStatusIn(@Param("statuses") java.util.List<ClassStatus> statuses, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM ClassEntity c WHERE (:statuses IS NULL OR c.status IN :statuses)")
    long countByStatusIn(@Param("statuses") java.util.List<ClassStatus> statuses);

    // N+1 Optimization to see how many distinct teachers are currently teaching
    @Query("SELECT COUNT(DISTINCT t.id) FROM ClassEntity c JOIN c.teachers t WHERE c.status IN :statuses")
    long countDistinctTeachersInActiveClasses(@Param("statuses") java.util.List<ClassStatus> statuses);

    @Query("SELECT COUNT(DISTINCT c.id) FROM ClassEntity c JOIN c.teachers t WHERE t.id = :teacherId AND c.status IN :statuses")
    long countActiveClassesByTeacher(
            @Param("teacherId") Long teacherId,
            @Param("statuses") java.util.List<ClassStatus> statuses
    );

    @EntityGraph(attributePaths = {"course", "defaultRoom", "teachers"})
    @Query("SELECT c FROM ClassEntity c JOIN c.teachers t WHERE t.id = :teacherId AND c.status IN :statuses")
    List<ClassEntity> findByTeacherIdAndStatusIn(
            @Param("teacherId") Long teacherId,
            @Param("statuses") List<ClassStatus> statuses
    );
}
