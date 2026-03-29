package com.f4.forum.service;

import com.f4.forum.dto.response.UserDirectoryResponse;
import com.f4.forum.dto.response.UserMetricsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Entry Point for User Management features.
 * Encapsulates the complexities of lower level data and command services.
 */
@Service
public class UserManagementFacade {

    private final UserQueryService userQueryService;
    private final UserCommandService userCommandService;

    public UserManagementFacade(UserQueryService userQueryService, UserCommandService userCommandService) {
        this.userQueryService = userQueryService;
        this.userCommandService = userCommandService;
    }

    public Page<UserDirectoryResponse> fetchUserDirectory(
            String query,
            String userType,
            String status,
            String role,
            Pageable pageable) {
        return userQueryService.getUserDirectory(query, userType, status, role, pageable);
    }

    public UserMetricsResponse calculateMetrics() {
        return userQueryService.getUserMetrics();
    }

    // Write operations (CRUD)
    public Long createUser(com.f4.forum.dto.request.CreateUserCommand command) {
        return userCommandService.executeCreateUser(command);
    }
    
    public void updateUser(Long id, com.f4.forum.dto.request.UpdateUserCommand command) {
        userCommandService.executeUpdateUser(id, command);
    }

    public void deleteUser(Long id) {
        userCommandService.executeDeleteUser(id);
    }
}
