package com.f4.forum.repository;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.enums.ClassStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    /**
     * Phục hồi các method cũ phục vụ Dashboard và PersonnelService
     */
    long countByStatusIn(List<ClassStatus> statuses);

    @Query(value = "SELECT COUNT(DISTINCT ct.teacher_id) FROM classes c JOIN class_teachers ct ON c.id = ct.class_id WHERE c.status IN :#{#statuses.![name()]}", nativeQuery = true)
    long countDistinctTeachersInActiveClasses(@Param("statuses") List<ClassStatus> statuses);
}
