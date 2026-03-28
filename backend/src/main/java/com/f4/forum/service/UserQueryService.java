package com.f4.forum.service;

import com.f4.forum.dto.response.UserDirectoryResponse;
import com.f4.forum.dto.response.UserMetricsResponse;
import com.f4.forum.entity.enums.UserStatus;
import com.f4.forum.entity.enums.UserType;
import com.f4.forum.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Strategy/Query Service for User Management operations.
 * Isolates read logic from complex business commands.
 */
@Service
@Transactional(readOnly = true)
public class UserQueryService {

    private final UserRepository userRepository;

    public UserQueryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get a paginated list of users joined with their accounts to avoid N+1 queries.
     * Uses Spring Data Pageable directly for clean slice requests.
     */
    public Page<UserDirectoryResponse> getUserDirectory(String searchTerm, Pageable pageable) {
        return userRepository.findUserDirectory(searchTerm, pageable);
    }

    /**
     * Compute aggregated metrics.
     */
    public UserMetricsResponse getUserMetrics() {
        long totalUsers = userRepository.count();
        long activeStudents = userRepository.countByUserTypeAndStatus(UserType.STUDENT, UserStatus.ACTIVE);
        long instructors = userRepository.countByUserType(UserType.TEACHER);
        long restrictedUsers = userRepository.countRestrictedUsers();

        return new UserMetricsResponse(
                totalUsers,
                activeStudents,
                instructors,
                restrictedUsers
        );
    }
}
