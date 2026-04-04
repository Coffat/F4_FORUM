package com.f4.forum.decorator.fee;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;

/**
 * ===== DECORATOR PATTERN =====
 * Base implementation - tính phí cơ bản (không có decoration).
 */
@Slf4j
public class BaseFeeCalculator implements FeeCalculator {

    @Override
    public BigDecimal calculate(BigDecimal baseAmount) {
        return baseAmount;
    }

    @Override
    public String getDescription() {
        return "Base Fee";
    }
}
