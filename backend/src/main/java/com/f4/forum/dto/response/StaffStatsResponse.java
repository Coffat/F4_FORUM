package com.f4.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Represents staff statistics for the dashboard")
public class StaffStatsResponse {
    @Schema(description = "Total number of faculty members and staff", example = "120")
    private long totalFaculty;
    
    @Schema(description = "Total active classes currently associated with teachers", example = "45")
    private long activeSessions;
    
    @Schema(description = "Percentage string representing active teachers / total teachers", example = "85%")
    private String onDutyRatio;
}
