package com.f4.forum.entity;

import com.f4.forum.entity.strategy.DiscountStrategyFactory;
import com.f4.forum.entity.strategy.FixedDiscountStrategy;
import com.f4.forum.entity.strategy.PercentDiscountStrategy;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "promo_code", nullable = false, unique = true, length = 50)
    private String promoCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 20)
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 15, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "max_discount_amount", precision = 15, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "end_date")
    private LocalDate endDate;

    public enum DiscountType {
        PERCENT,  // Giảm theo phần trăm
        FIXED     // Giảm trực tiếp (số tiền cố định)
    }

    public boolean isValid() {
        return endDate == null || !LocalDate.now().isAfter(endDate);
    }
    
    /**
     * ===== STRATEGY PATTERN =====
     * Sử dụng Strategy để tính discount - thay thế if-else
     * Mỗi loại discountType sẽ sử dụng strategy tương ứng
     */
    public BigDecimal calculateDiscount(BigDecimal baseAmount) {
        if (!isValid() || discountValue == null || discountType == null) {
            return BigDecimal.ZERO;
        }
        
        if (baseAmount == null || baseAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        // Áp dụng Strategy tương ứng với discountType
        if (discountType == DiscountType.PERCENT) {
            return new PercentDiscountStrategy()
                    .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
        } else if (discountType == DiscountType.FIXED) {
            return new FixedDiscountStrategy()
                    .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
        }
        
        return BigDecimal.ZERO;
    }
}
