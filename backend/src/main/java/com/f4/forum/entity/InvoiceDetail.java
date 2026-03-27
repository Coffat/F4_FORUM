package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_details")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    private String description;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalPrice = BigDecimal.ZERO;

    // Package-private
    void assignToInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    @PrePersist
    @PreUpdate
    private void calculateFinalPrice() {
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
        this.finalPrice = this.unitPrice.subtract(this.discountAmount);
        if (this.finalPrice.compareTo(BigDecimal.ZERO) < 0) {
            this.finalPrice = BigDecimal.ZERO;
        }
    }
}
