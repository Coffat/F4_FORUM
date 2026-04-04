package com.f4.forum.decorator.fee;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * ===== DECORATOR PATTERN =====
 * Demo cách sử dụng Decorator để tính phí động.
 */
@Component
public class FeeCalculatorDemo {

    /**
     * Ví dụ: Tính phí khóa học với giảm giá + phí đăng ký.
     * 
     * Base: 1,000,000 VND
     * - Discount 20%: 800,000 VND
     * + Registration Fee: 820,000 VND
     */
    public BigDecimal calculateCourseFee(BigDecimal baseFee) {
        // Khởi tạo base calculator
        FeeCalculator calculator = new BaseFeeCalculator();
        
        // Giảm giá 20%
        calculator = new DiscountDecorator(calculator, new BigDecimal("0.20"));
        
        // Thêm phí đăng ký 20,000 VND
        calculator = new RegistrationFeeDecorator(calculator, new BigDecimal("20000"));
        
        // Tính tổng phí
        BigDecimal totalFee = calculator.calculate(baseFee);
        
        System.out.println("=== Fee Calculation ===");
        System.out.println("Description: " + calculator.getDescription());
        System.out.println("Base Fee: " + baseFee + " VND");
        System.out.println("Total Fee: " + totalFee + " VND");
        
        return totalFee;
    }
}
