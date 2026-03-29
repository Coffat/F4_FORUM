package com.f4.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatsResponse {
    private long totalActiveCourses;
    private long newThisMonth;
    private double averageEnrollment;
    private BigDecimal totalRevenue;
}
