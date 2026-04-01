package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class InvoiceOverdueState implements InvoiceState {

    private static final BigDecimal PENALTY_RATE = new BigDecimal("0.05"); // 5%

    @Override
    public void pay(Invoice invoice, BigDecimal amount) {
        BigDecimal penalty = calculatePenalty(invoice.getFinalAmount());
        BigDecimal totalDue = invoice.getFinalAmount().add(penalty);
        
        if (amount.compareTo(totalDue) >= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.markAsPaid();
            log.info("✅ [STATE] Invoice {} paid with penalty: {}", invoice.getId(), penalty);
        } else {
            throw new IllegalArgumentException("Amount must include overdue penalty. Total due: " + totalDue);
        }
    }

    @Override
    public void cancel(Invoice invoice) {
        invoice.setStatus(InvoiceStatus.CANCELLED);
        log.info("❌ [STATE] Overdue invoice {} cancelled", invoice.getId());
    }

    @Override
    public void markAsOverdue(Invoice invoice) {
        throw new IllegalStateException("Invoice is already overdue");
    }

    @Override
    public void processRefund(Invoice invoice, BigDecimal amount) {
        throw new IllegalStateException("Cannot refund overdue invoice");
    }

    @Override
    public String getStateName() {
        return "OVERDUE";
    }

    @Override
    public boolean canPay() {
        return true;
    }

    @Override
    public boolean canCancel() {
        return true;
    }

    @Override
    public boolean canRefund() {
        return false;
    }

    private BigDecimal calculatePenalty(BigDecimal amount) {
        return amount.multiply(PENALTY_RATE);
    }
}
