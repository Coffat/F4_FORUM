package com.f4.forum.dto.invoice;

import com.f4.forum.entity.enums.InvoiceStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class InvoiceResponse {
    private Long id;
    private String invoiceCode;
    private StudentInfo student;
    private BigDecimal baseAmount;
    private BigDecimal finalAmount;
    private InvoiceStatus status;
    private LocalDate dueDate;
    private List<InvoiceDetailResponse> details;
    private List<PromotionInfo> promotions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class StudentInfo {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
    }

    @Data
    @Builder
    public static class InvoiceDetailResponse {
        private Long id;
        private Long courseId;
        private String courseName;
        private String description;
        private BigDecimal unitPrice;
        private BigDecimal discountAmount;
        private BigDecimal finalPrice;
    }

    @Data
    @Builder
    public static class PromotionInfo {
        private Long id;
        private String code;
        private String name;
        private String discountType;
        private BigDecimal discountValue;
        private BigDecimal maxDiscountAmount;
        private LocalDate endDate;
        private boolean valid;
    }

    @Data
    @Builder
    public static class EnrollmentInfo {
        private Long id;
        private Long classId;
        private String classCode;
        private String courseName;
    }

    @Data
    @Builder
    public static class CourseInfo {
        private Long id;
        private String code;
        private String name;
        private BigDecimal fee;
        private String level;
    }
}
