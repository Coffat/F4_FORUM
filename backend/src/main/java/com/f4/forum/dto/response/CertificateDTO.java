package com.f4.forum.dto.response;

import java.time.LocalDate;

public record CertificateDTO(
    String type,
    LocalDate issueDate,
    String score,
    String url
) {
}
