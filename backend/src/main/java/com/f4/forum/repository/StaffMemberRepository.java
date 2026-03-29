package com.f4.forum.repository;

import com.f4.forum.entity.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffMemberRepository extends JpaRepository<StaffMember, Long> {

    @Query("SELECT s FROM StaffMember s LEFT JOIN FETCH UserAccount ua ON s.id = ua.user.id ORDER BY s.fullName ASC")
    List<StaffMember> findAllStaffWithAccount();

}
