package com.f4.forum.entity.strategy;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * ===== STRATEGY PATTERN - Concrete Strategy =====
 * Chiến lược giảm giá theo phần trăm (%).
 */
public class PercentDiscountStrategy implements DiscountStrategy {
    
    @Override
    public BigDecimal calculate(BigDecimal baseAmount, BigDecimal maxDiscountAmount) {
        // Default - sẽ được gọi với discountValue từ Promotion entity
        return BigDecimal.ZERO;
    }
    
    /**
     * Tính giảm giá theo phần trăm với giá trị cụ thể
     */
    public BigDecimal calculateWithValue(BigDecimal discountValue, BigDecimal baseAmount, BigDecimal maxDiscountAmount) {
        if (!isValid(discountValue, baseAmount)) {
            return BigDecimal.ZERO;
        }
        
        // Tính: baseAmount * discountValue / 100
        BigDecimal discount = baseAmount
                .multiply(discountValue)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        // Áp dụng max discount nếu có
        return applyMaxDiscount(discount, maxDiscountAmount);
    }
    
    private boolean isValid(BigDecimal discountValue, BigDecimal baseAmount) {
        return discountValue != null 
                && baseAmount != null 
                && discountValue.compareTo(BigDecimal.ZERO) > 0
                && baseAmount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    private BigDecimal applyMaxDiscount(BigDecimal discount, BigDecimal maxDiscountAmount) {
        if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
            return maxDiscountAmount;
        }
        return discount;
    }
    
    @Override
    public String getType() {
        return "PERCENT";
    }
}
