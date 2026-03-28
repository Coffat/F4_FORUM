package com.f4.forum.repository;

import com.f4.forum.dto.response.UserDirectoryResponse;
import com.f4.forum.entity.User;
import com.f4.forum.entity.enums.UserStatus;
import com.f4.forum.entity.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // N+1 Optimization: Direct mapping via JPQL constructor mapping to DTO
    @Query("""
       SELECT new com.f4.forum.dto.response.UserDirectoryResponse(
           u.id, u.fullName, u.email, u.phone, 
           CAST(u.userType as string), CAST(ua.role as string), CAST(u.status as string), ua.lastLogin)
       FROM User u
       LEFT JOIN UserAccount ua ON u.id = ua.user.id
       WHERE (:searchTerm IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
              OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
    """)
    Page<UserDirectoryResponse> findUserDirectory(@Param("searchTerm") String searchTerm, Pageable pageable);

    long countByUserTypeAndStatus(UserType type, UserStatus status);
    
    long countByUserType(UserType type);
    
    // Use JPQL to define a generic status filter since JPA might struggle with multiple Enums
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'INACTIVE' OR u.status = 'BANNED'")
    long countRestrictedUsers();
}
