package com.f4.forum.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Record StudentProfileResponse: Bao đóng toàn bộ dữ liệu hồ sơ cá nhân.
 * Immutability đảm bảo an toàn dữ liệu xuyên suốt các tầng.
 */
public record StudentProfileResponse(
    // Thông tin cá nhân
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    LocalDate dateOfBirth,
    String avatarUrl,

    // Thông tin học tập
    BigDecimal targetScore,
    LocalDate admissionDate,

    // Danh sách điểm đầu vào & Chứng chỉ
    List<PlacementTestDTO> placementTests,
    List<CertificateDTO> certificates
) {
}
