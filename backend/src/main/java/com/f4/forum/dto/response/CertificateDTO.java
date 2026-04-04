package com.f4.forum.dto.response;

import java.time.LocalDate;

public record CertificateDTO(
    String name,
    LocalDate issueDate,
    String url
) {
}
