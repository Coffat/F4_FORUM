package com.f4.forum.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO tổng hợp toàn bộ dữ liệu cần thiết cho trang Staff Dashboard.
 * Áp dụng Builder Pattern để đảm bảo tính immutable khi khởi tạo đối tượng phức tạp.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Aggregated metrics and data for the Staff Operations Dashboard")
public class StaffDashboardMetricsResponse {

    // --- KPI Metrics (Top Cards) ---

    @Schema(description = "Total number of teaching and admin staff", example = "42")
    private long totalFaculty;

    @Schema(description = "Number of classes currently OPEN or IN_PROGRESS", example = "18")
    private long activeSessions;

    @Schema(description = "Percentage of teachers currently on duty", example = "85%")
    private String onDutyRatio;

    @Schema(description = "Number of currently active (non-suspended) staff members", example = "39")
    private long activeStaffCount;

    // --- Staff Segment Counts (for tab summary) ---

    @Schema(description = "Total number of teachers in the system", example = "28")
    private long totalTeachers;

    @Schema(description = "Total number of administrative staff members", example = "14")
    private long totalAdminStaff;

    // --- Recently Checked-In Staff (livefeed widget) ---

    @Schema(description = "List of recently active staff members derived from DB creation date")
    private List<RecentStaffEntry> recentlyActive;

    /**
     * Nested DTO - đại diện một dòng trong widget 'Recently Active Staff'.
     * Builder Pattern đảm bảo mỗi entry là bất biến từ khi tạo.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "A single recently-active staff entry for the dashboard live feed")
    public static class RecentStaffEntry {

        @Schema(description = "User ID of the staff member", example = "5")
        private Long id;

        @Schema(description = "Full name", example = "Trần Thị B")
        private String name;

        @Schema(description = "Department or Specialty", example = "IELTS Academic")
        private String departmentOrSpecialty;

        @Schema(description = "Role type badge label", example = "TEACHER")
        private String roleLabel;

        @Schema(description = "Avatar URL", example = "https://i.pravatar.cc/150?u=5")
        private String avatar;

        @Schema(description = "Whether the user is currently active", example = "true")
        private boolean isActive;
    }
}
