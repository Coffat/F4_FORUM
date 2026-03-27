package com.f4.forum.entity;

import com.f4.forum.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(length = 50)
    private String method;

    @Column(name = "reference_code", length = 100)
    private String referenceCode;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private PaymentStatus status;
    
    @Version
    private Long version;

    public void processSuccess(String referenceCode) {
        this.status = PaymentStatus.SUCCESS;
        this.referenceCode = referenceCode;
        // Bắn event để chuyển invoice sang PAID sau khi gọi logic này bằng Observer Pattern
    }

    public void processFailure() {
        this.status = PaymentStatus.FAILED;
    }
}
