package com.f4.forum.dto.invoice;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateInvoiceCommand {
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    private LocalDate dueDate;
    
    private List<InvoiceDetailItem> details;
    
    private List<Long> promotionIds;

    @Data
    public static class InvoiceDetailItem {
        @NotNull(message = "Course ID is required")
        private Long courseId;
        
        private String description;
        
        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
        
        private BigDecimal discountAmount = BigDecimal.ZERO;
    }
}
