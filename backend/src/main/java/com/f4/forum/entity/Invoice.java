package com.f4.forum.entity;

import com.f4.forum.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    // Rich Domain Model
    public void addDetail(InvoiceDetail detail) {
        details.add(detail);
        detail.assignToInvoice(this);
        recalculateTotals();
    }

    public void applyPromotion(Promotion promotion) {
        if (promotion.isValid()) {
            this.promotions.add(promotion);
            recalculateTotals();
        } else {
            throw new IllegalArgumentException("Promotion is expired or invalid");
        }
    }
    
    public void markAsPaid() {
        this.status = InvoiceStatus.PAID;
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
