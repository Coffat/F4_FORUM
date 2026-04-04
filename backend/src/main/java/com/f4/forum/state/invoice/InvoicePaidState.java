package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class InvoicePaidState implements InvoiceState {

    @Override
    public void pay(Invoice invoice, BigDecimal amount) {
        throw new IllegalStateException("Invoice is already paid");
    }

    @Override
    public void cancel(Invoice invoice) {
        invoice.setStatus(InvoiceStatus.CANCELLED);
        log.info("❌ [STATE] Paid invoice {} cancelled - may require refund", invoice.getId());
    }

    @Override
    public void markAsOverdue(Invoice invoice) {
        throw new IllegalStateException("Cannot mark paid invoice as overdue");
    }

    @Override
    public void processRefund(Invoice invoice, BigDecimal amount) {
        invoice.setStatus(InvoiceStatus.REFUNDED);
        log.info("💰 [STATE] Refund processed for invoice {}: {}", invoice.getId(), amount);
    }

    @Override
    public String getStateName() {
        return "PAID";
    }

    @Override
    public boolean canPay() {
        return false;
    }

    @Override
    public boolean canCancel() {
        return true;
    }

    @Override
    public boolean canRefund() {
        return true;
    }
}
