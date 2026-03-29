package com.f4.forum.repository;

import com.f4.forum.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    @Query("SELECT t FROM Teacher t LEFT JOIN FETCH UserAccount ua ON t.id = ua.user.id ORDER BY t.fullName ASC")
    List<Teacher> findAllTeachersWithAccount();

    long count();
}
