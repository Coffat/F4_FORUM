package com.f4.forum.entity.strategy;

import java.math.BigDecimal;

/**
 * ===== STRATEGY PATTERN =====
 * Định nghĩa interface cho các thuật toán tính giảm giá khác nhau.
 * Cho phép interchangeable giữa các strategy mà không thay đổi client code.
 */
public interface DiscountStrategy {
    
    /**
     * Tính toán số tiền giảm giá
     * @param baseAmount Số tiền gốc
     * @param maxDiscountAmount Giới hạn giảm tối đa (có thể null)
     * @return Số tiền giảm
     */
    BigDecimal calculate(BigDecimal baseAmount, BigDecimal maxDiscountAmount);
    
    /**
     * Lấy mô tả loại giảm giá
     */
    String getType();
}
