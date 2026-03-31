package com.f4.forum.dto.promotion;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromotionRequest {
    @NotBlank(message = "Mã voucher là bắt buộc")
    @Size(min = 3, max = 50, message = "Mã voucher phải từ 3-50 ký tự")
    private String code;
    
    @NotNull(message = "Loại giảm giá là bắt buộc")
    private String discountType; // PERCENT hoặc FIXED
    
    @NotNull(message = "Giá trị giảm giá là bắt buộc")
    @DecimalMin(value = "0", message = "Giá trị giảm giá phải >= 0")
    private BigDecimal discountValue;
    
    private BigDecimal maxDiscountAmount;
    
    private LocalDate endDate;
}
