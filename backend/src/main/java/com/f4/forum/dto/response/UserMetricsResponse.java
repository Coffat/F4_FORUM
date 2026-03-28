package com.f4.forum.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Aggregated metrics for User Management Dashboard")
public record UserMetricsResponse(
        @Schema(description = "Total number of mapped user accounts")
        long totalUsers,

        @Schema(description = "Total ACTIVE users categorized as students")
        long activeStudents,

        @Schema(description = "Total number of teachers/instructors")
        long instructors,

        @Schema(description = "Total users with restricted or banned access")
        long restrictedUsers
) {}
