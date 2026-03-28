package com.f4.forum.controller;

import com.f4.forum.dto.request.CreateUserCommand;
import com.f4.forum.dto.request.UpdateUserCommand;
import com.f4.forum.dto.response.UserDirectoryResponse;
import com.f4.forum.dto.response.UserMetricsResponse;
import com.f4.forum.service.UserManagementFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "Admin - User Management API", description = "Endpoints for administering users, instructors and staffs")
public class AdminUserController {

    private final UserManagementFacade userManagementFacade;

    public AdminUserController(UserManagementFacade userManagementFacade) {
        this.userManagementFacade = userManagementFacade;
    }

    @Operation(summary = "Get User Directory", description = "Returns a paginated list of users joined with their system accounts. Avoids N+1 using a custom JPQL query.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users")
    })
    @GetMapping
    public ResponseEntity<Page<UserDirectoryResponse>> getUserDirectory(
            @Parameter(description = "Search term for emails and full names") 
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<UserDirectoryResponse> users = userManagementFacade.fetchUserDirectory(search, pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get User Metrics", description = "Counts total users, active students, instructors, and restricted members based on their types and statuses.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Metrics calculated successfully")
    })
    @GetMapping("/metrics")
    public ResponseEntity<UserMetricsResponse> getUserMetrics() {
        UserMetricsResponse metrics = userManagementFacade.calculateMetrics();
        return ResponseEntity.ok(metrics);
    }

    @Operation(summary = "Create User", description = "Creates a new user (Student/Teacher/Staff) and their corresponding login account.")
    @PostMapping
    public ResponseEntity<Long> createUser(@RequestBody @Valid CreateUserCommand command) {
        Long id = userManagementFacade.createUser(command);
        return new ResponseEntity<>(id, HttpStatus.CREATED);
    }

    @Operation(summary = "Update User", description = "Updates essential information of an existing user.")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserCommand command) {
        userManagementFacade.updateUser(id, command);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete User", description = "Permenantly removes a user and their associated login account.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userManagementFacade.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
