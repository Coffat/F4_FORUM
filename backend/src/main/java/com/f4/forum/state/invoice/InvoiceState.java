package com.f4.forum.state.invoice;

import com.f4.forum.entity.Invoice;

import java.math.BigDecimal;

/**
 * ===== STATE PATTERN =====
 * Interface định nghĩa các hành vi của Invoice ở mỗi trạng thái.
 * Mỗi State class implement logic riêng cho trạng thái đó.
 */
public interface InvoiceState {
    
    /**
     * Thanh toán invoice.
     */
    void pay(Invoice invoice, BigDecimal amount);
    
    /**
     * Hủy invoice.
     */
    void cancel(Invoice invoice);
    
    /**
     * Đánh dấu là quá hạn.
     */
    void markAsOverdue(Invoice invoice);
    
    /**
     * Xử lý hoàn tiền.
     */
    void processRefund(Invoice invoice, BigDecimal amount);
    
    /**
     * Lấy tên trạng thái.
     */
    String getStateName();
    
    /**
     * Kiểm tra có thể thanh toán không.
     */
    boolean canPay();
    
    /**
     * Kiểm tra có thể hủy không.
     */
    boolean canCancel();
    
    /**
     * Kiểm tra có thể hoàn tiền không.
     */
    boolean canRefund();
}
