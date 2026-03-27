package com.f4.forum.entity;

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

    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Column(name = "max_discount_amount", precision = 15, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "end_date")
    private LocalDate endDate;

    public boolean isValid() {
        return endDate == null || !LocalDate.now().isAfter(endDate);
    }
    
    public BigDecimal calculateDiscount(BigDecimal baseAmount) {
        if (!isValid() || discountPercent == null) return BigDecimal.ZERO;
        
        BigDecimal discount = baseAmount.multiply(discountPercent).divide(BigDecimal.valueOf(100));
        if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
            return maxDiscountAmount;
        }
        return discount;
    }
}
