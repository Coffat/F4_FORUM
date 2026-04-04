package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
public class InvoiceCancelledState implements InvoiceState {

    @Override
    public void pay(Invoice invoice, BigDecimal amount) {
        throw new IllegalStateException("Cannot pay a cancelled invoice");
    }

    @Override
    public void cancel(Invoice invoice) {
        throw new IllegalStateException("Invoice is already cancelled");
    }

    @Override
    public void markAsOverdue(Invoice invoice) {
        throw new IllegalStateException("Cannot mark cancelled invoice as overdue");
    }

    @Override
    public void processRefund(Invoice invoice, BigDecimal amount) {
        throw new IllegalStateException("Cannot refund cancelled invoice");
    }

    @Override
    public String getStateName() {
        return "CANCELLED";
    }

    @Override
    public boolean canPay() {
        return false;
    }

    @Override
    public boolean canCancel() {
        return false;
    }

    @Override
    public boolean canRefund() {
        return false;
    }
}
