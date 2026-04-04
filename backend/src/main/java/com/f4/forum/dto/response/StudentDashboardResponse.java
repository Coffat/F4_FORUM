package com.f4.forum.dto.response;

import java.time.LocalDate;
import java.util.List;

/**
 * Dashboard Response dành riêng cho Role Student.
 * Tuân thủ chuẩn Record của Java 21 để đảm bảo tính bất biến (Immutability).
 */
public record StudentDashboardResponse(
    Long userId,
    String fullName,
    String email,
    String phone,
    List<EnrolledClassResponse> enrolledClasses
) {
    public record EnrolledClassResponse(
        Long id,
        String classCode,
        String courseName,
        LocalDate startDate,
        LocalDate endDate,
        String status
    ) {}
}
