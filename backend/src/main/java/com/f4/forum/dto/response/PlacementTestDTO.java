package com.f4.forum.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PlacementTestDTO(
    LocalDate testDate,
    BigDecimal listening,
    BigDecimal speaking,
    BigDecimal reading,
    BigDecimal writing,
    BigDecimal overall
) {
}
