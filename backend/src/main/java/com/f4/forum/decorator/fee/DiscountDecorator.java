package com.f4.forum.decorator.fee;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * ===== DECORATOR PATTERN =====
 * Decorator giảm giá (%).
 * Không sửa đổi class gốc.
 */
@RequiredArgsConstructor
public class DiscountDecorator implements FeeCalculator {

    private final FeeCalculator wrappedCalculator;
    private final BigDecimal discountPercent; // e.g., 0.20 for 20% off

    @Override
    public BigDecimal calculate(BigDecimal baseAmount) {
        BigDecimal baseFee = wrappedCalculator.calculate(baseAmount);
        BigDecimal discountAmount = baseFee.multiply(discountPercent).setScale(2, RoundingMode.HALF_UP);
        
        return baseFee.subtract(discountAmount);
    }

    @Override
    public String getDescription() {
        return wrappedCalculator.getDescription() + " - Discount (" + (discountPercent.multiply(BigDecimal.valueOf(100)).intValue()) + "%)";
    }
}
