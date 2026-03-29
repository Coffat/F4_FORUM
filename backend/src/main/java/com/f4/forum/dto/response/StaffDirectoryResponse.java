package com.f4.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represents a staff member or teacher profile")
public class StaffDirectoryResponse {
    @Schema(description = "User ID", example = "5")
    private Long id;
    
    @Schema(description = "Full Name", example = "Trần B")
    private String name;
    
    @Schema(description = "Formatted Join Date", example = "Joined Jan 2024")
    private String joined;
    
    @Schema(description = "Avatar URL", example = "/images/avatars/default.png")
    private String avatar;
    
    @Schema(description = "Is user account active", example = "true")
    private boolean isActive;
    
    @Schema(description = "Roles list assigned to user")
    private List<RoleBadge> roles;
    
    @Schema(description = "Specialty (Teacher) or Department (Staff)", example = "IELTS 8.5")
    private String specialty;
    
    @Schema(description = "Email", example = "tranb@f4forum.com")
    private String email;
    
    @Schema(description = "Phone", example = "0912345678")
    private String phone;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Role representation for UI")
    public static class RoleBadge {
        @Schema(description = "Role ID/Name", example = "ROLE_TEACHER")
        private String id;
        
        @Schema(description = "Display Label", example = "TEACHER")
        private String label;
        
        @Schema(description = "Tailwind CSS Color class", example = "text-blue-600 bg-blue-50")
        private String color;
    }
}
