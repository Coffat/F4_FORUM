package com.f4.forum.entity.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * ===== FACTORY PATTERN kết hợp STRATEGY =====
 * Factory để tạo và quản lý các DiscountStrategy theo discountType.
 * Sử dụng Map để lookup nhanh, tránh if-else/switch.
 */
@Component
public class DiscountStrategyFactory {

    private final Map<String, DiscountStrategy> strategies;

    /**
     * Constructor nhận vào danh sách các strategy và tự động đăng ký.
     * Spring sẽ inject tất cả các bean implements DiscountStrategy.
     */
    public DiscountStrategyFactory(List<DiscountStrategy> strategyList) {
        // Map các strategy theo type - sử dụng getType() làm key
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        DiscountStrategy::getType,
                        Function.identity()
                ));
    }

    /**
     * Lấy strategy theo discount type
     * @param discountType Loại giảm giá (PERCENT, FIXED, etc.)
     * @return Strategy tương ứng hoặc throw exception nếu không tìm thấy
     */
    public DiscountStrategy getStrategy(String discountType) {
        DiscountStrategy strategy = strategies.get(discountType);
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown discount type: " + discountType);
        }
        return strategy;
    }

    /**
     * Kiểm tra discount type có hợp lệ không
     */
    public boolean isValidType(String discountType) {
        return strategies.containsKey(discountType);
    }

    /**
     * Tính discount với strategy được chọn
     */
    public BigDecimal calculateDiscount(String discountType, BigDecimal discountValue, 
            BigDecimal baseAmount, BigDecimal maxDiscountAmount) {
        
        DiscountStrategy strategy = getStrategy(discountType);
        
        // Áp dụng discountValue vào strategy
        if (strategy instanceof PercentDiscountStrategy) {
            return ((PercentDiscountStrategy) strategy)
                    .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
        } else if (strategy instanceof FixedDiscountStrategy) {
            return ((FixedDiscountStrategy) strategy)
                    .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
        }
        
        return BigDecimal.ZERO;
    }
}
