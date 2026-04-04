package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class InvoicePendingState implements InvoiceState {

    @Override
    public void pay(Invoice invoice, BigDecimal amount) {
        if (amount.compareTo(invoice.getFinalAmount()) >= 0) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.markAsPaid();
            log.info("✅ [STATE] Invoice {} chuyển từ PENDING sang PAID", invoice.getId());
        } else {
            throw new IllegalArgumentException("Insufficient payment amount. Required: " + invoice.getFinalAmount());
        }
    }

    @Override
    public void cancel(Invoice invoice) {
        invoice.setStatus(InvoiceStatus.CANCELLED);
        log.info("❌ [STATE] Invoice {} cancelled", invoice.getId());
    }

    @Override
    public void markAsOverdue(Invoice invoice) {
        invoice.setStatus(InvoiceStatus.OVERDUE);
        log.warn("⚠️ [STATE] Invoice {} marked as OVERDUE", invoice.getId());
    }

    @Override
    public void processRefund(Invoice invoice, BigDecimal amount) {
        throw new IllegalStateException("Cannot refund a pending invoice");
    }

    @Override
    public String getStateName() {
        return "PENDING";
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
}
