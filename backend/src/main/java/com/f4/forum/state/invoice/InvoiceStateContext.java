package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceStateContext {

    private final InvoicePendingState pendingState;
    private final InvoicePaidState paidState;
    private final InvoiceOverdueState overdueState;
    private final InvoiceCancelledState cancelledState;

    /**
     * Lấy state object tương ứng với InvoiceStatus.
     */
    public InvoiceState getState(Invoice invoice) {
        return getState(invoice.getStatus());
    }

    public InvoiceState getState(InvoiceStatus status) {
        return switch (status) {
            case PENDING -> pendingState;
            case PAID -> paidState;
            case OVERDUE -> overdueState;
            case CANCELLED -> cancelledState;
            case REFUNDED -> paidState; // Refunded treated like paid for state transitions
            default -> pendingState;
        };
    }

    /**
     * Thanh toán invoice.
     */
    public void pay(Invoice invoice, BigDecimal amount) {
        getState(invoice).pay(invoice, amount);
    }

    /**
     * Hủy invoice.
     */
    public void cancel(Invoice invoice) {
        getState(invoice).cancel(invoice);
    }

    /**
     * Đánh dấu quá hạn.
     */
    public void markAsOverdue(Invoice invoice) {
        getState(invoice).markAsOverdue(invoice);
    }

    /**
     * Hoàn tiền.
     */
    public void refund(Invoice invoice, BigDecimal amount) {
        getState(invoice).processRefund(invoice, amount);
    }

    /**
     * Kiểm tra có thể thanh toán không.
     */
    public boolean canPay(Invoice invoice) {
        return getState(invoice).canPay();
    }

    /**
     * Kiểm tra có thể hủy không.
     */
    public boolean canCancel(Invoice invoice) {
        return getState(invoice).canCancel();
    }

    /**
     * Kiểm tra có thể hoàn tiền không.
     */
    public boolean canRefund(Invoice invoice) {
        return getState(invoice).canRefund();
    }
}
