package com.f4.forum.decorator.fee;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * ===== DECORATOR PATTERN =====
 * Decorator thêm phí đăng ký (fixed amount).
 * Không sửa đổi class gốc.
 */
@RequiredArgsConstructor
public class RegistrationFeeDecorator implements FeeCalculator {

    private final FeeCalculator wrappedCalculator;
    private final BigDecimal registrationFee; // Fixed fee amount

    @Override
    public BigDecimal calculate(BigDecimal baseAmount) {
        BigDecimal baseFee = wrappedCalculator.calculate(baseAmount);
        
        return baseFee.add(registrationFee);
    }

    @Override
    public String getDescription() {
        return wrappedCalculator.getDescription() + " + Registration Fee (" + registrationFee + ")";
    }
}
