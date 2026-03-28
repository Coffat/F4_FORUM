package com.f4.forum.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Response payload containing summarized user data for directory tables")
public record UserDirectoryResponse(
        @Schema(description = "User unique identifier")
        Long id,
        
        @Schema(description = "Full name of the user", example = "Sarah Jenkins")
        String fullName,
        
        @Schema(description = "Email address")
        String email,
        
        @Schema(description = "Phone number")
        String phone,
        
        @Schema(description = "User type from the User entity", example = "STUDENT")
        String userType,
        
        @Schema(description = "Assigned system role from UserAccount", example = "ROLE_STUDENT")
        String role,
        
        @Schema(description = "User status", example = "ACTIVE")
        String status,
        
        @Schema(description = "Latest login timestamp")
        LocalDateTime lastLogin
) {}
