package com.f4.forum.entity.strategy;

import java.math.BigDecimal;

/**
 * ===== STRATEGY PATTERN - Concrete Strategy =====
 * Chiến lược giảm giá trực tiếp (số tiền cố định).
 */
public class FixedDiscountStrategy implements DiscountStrategy {
    
    @Override
    public BigDecimal calculate(BigDecimal baseAmount, BigDecimal maxDiscountAmount) {
        // Default - sẽ được gọi với discountValue từ Promotion entity
        return BigDecimal.ZERO;
    }
    
    /**
     * Tính giảm giá trực tiếp với giá trị cụ thể
     */
    public BigDecimal calculateWithValue(BigDecimal discountValue, BigDecimal baseAmount, BigDecimal maxDiscountAmount) {
        if (!isValid(discountValue, baseAmount)) {
            return BigDecimal.ZERO;
        }
        
        // Discount = discountValue (giá trị cố định)
        BigDecimal discount = discountValue;
        
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
        return "FIXED";
    }
}
