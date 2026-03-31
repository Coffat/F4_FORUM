package com.f4.forum.repository;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.enums.ClassStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    @Query("SELECT COUNT(c) FROM ClassEntity c WHERE c.status IN :statuses")
    long countByStatusIn(@Param("statuses") java.util.List<ClassStatus> statuses);
    
    // N+1 Optimization to see how many distinct teachers are currently teaching
    @Query("SELECT COUNT(DISTINCT t.id) FROM ClassEntity c JOIN c.teachers t WHERE c.status IN :statuses")
    long countDistinctTeachersInActiveClasses(@Param("statuses") java.util.List<ClassStatus> statuses);

    @Query("SELECT COUNT(DISTINCT c.id) FROM ClassEntity c JOIN c.teachers t WHERE t.id = :teacherId AND c.status IN :statuses")
    long countActiveClassesByTeacher(
            @Param("teacherId") Long teacherId,
            @Param("statuses") java.util.List<ClassStatus> statuses
    );

}
