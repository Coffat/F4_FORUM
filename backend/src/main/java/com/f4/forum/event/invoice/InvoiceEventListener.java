package com.f4.forum.event.invoice;

import com.f4.forum.adapter.NotificationAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceEventListener {

    private final NotificationAdapter notificationAdapter;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onInvoiceCreated(InvoiceCreatedEvent event) {
        log.info("📄 [OBSERVER] Invoice created: {} for student {} ({}) - Amount: {}", 
                event.getInvoiceCode(), 
                event.getStudentName(), 
                event.getStudentEmail(),
                event.getFinalAmount());
        
        notificationAdapter.call(Map.of(
                "userId", event.getStudentId().toString(),
                "title", "Invoice Created",
                "message", String.format("Your invoice %s is ready. Amount: %s, Due: %s", 
                        event.getInvoiceCode(), 
                        event.getFinalAmount(),
                        event.getDueDate()),
                "type", "INVOICE"
        ));
        
        log.info("📧 [OBSERVER] Notification sent for invoice: {}", event.getInvoiceCode());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onInvoicePaid(InvoicePaidEvent event) {
        log.info("💰 [OBSERVER] Invoice paid: {} by student {} ({}) - Amount: {}", 
                event.getInvoiceCode(),
                event.getStudentName(),
                event.getStudentId(),
                event.getAmountPaid());
        
        notificationAdapter.call(Map.of(
                "userId", event.getStudentId().toString(),
                "title", "Payment Received",
                "message", String.format("Payment for invoice %s received. Amount: %s", 
                        event.getInvoiceCode(),
                        event.getAmountPaid()),
                "type", "PAYMENT"
        ));
    }
}
