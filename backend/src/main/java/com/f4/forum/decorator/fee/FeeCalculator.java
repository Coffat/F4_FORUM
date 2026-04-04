package com.f4.forum.decorator.fee;

import java.math.BigDecimal;

/**
 * ===== DECORATOR PATTERN =====
 * Interface cho tính phí động.
 * Có thể thêm thuế, giảm giá, phí dịch vụ mà không sửa đổi class gốc.
 */
public interface FeeCalculator {
    
    /**
     * Tính tổng phí dựa trên base amount.
     */
    BigDecimal calculate(BigDecimal baseAmount);
    
    /**
     * Lấy mô tả chi tiết phí.
     */
    default String getDescription() {
        return "Base Fee";
    }
}
