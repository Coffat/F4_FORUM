package com.f4.forum.entity;

import com.f4.forum.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Builder;

@Entity
@Table(name = "invoices")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Builder.Default
    @Column(name = "base_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal baseAmount = BigDecimal.ZERO;
    
    @Builder.Default
    @Column(name = "final_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private InvoiceStatus status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Builder.Default
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceDetail> details = new ArrayList<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
        name = "invoice_promotions",
        joinColumns = @JoinColumn(name = "invoice_id"),
        inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private Set<Promotion> promotions = new HashSet<>();

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Rich Domain Model - Sử dụng Tell, Don't Ask pattern
    public void addDetail(InvoiceDetail detail) {
        details.add(detail);
        detail.assignToInvoice(this);
        // Tính toán finalPrice trước khi recalculateTotals
        detail.calculateFinalPrice();
    }

    public void applyPromotion(Promotion promotion) {
        if (promotion.isValid()) {
            this.promotions.add(promotion);
        } else {
            throw new IllegalArgumentException("Promotion is expired or invalid");
        }
    }

    // Gọi sau khi tất cả details và promotions đã được thêm vào
    public void recalculateAll() {
        recalculateTotals();
    }
    
    public void markAsPaid() {
        this.status = InvoiceStatus.PAID;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }
    
    private void recalculateTotals() {
        this.baseAmount = details.stream()
                .map(InvoiceDetail::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal discount = BigDecimal.ZERO;
        for (Promotion p : promotions) {
            discount = discount.add(p.calculateDiscount(this.baseAmount));
        }

        this.finalAmount = this.baseAmount.subtract(discount);
        if (this.finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            this.finalAmount = BigDecimal.ZERO;
        }
    }
}
