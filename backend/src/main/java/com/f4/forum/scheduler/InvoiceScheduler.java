package com.f4.forum.scheduler;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import com.f4.forum.repository.InvoiceRepository;
import com.f4.forum.state.invoice.InvoiceStateContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceScheduler {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceStateContext invoiceStateContext;

    /**
     * Chạy mỗi ngày lúc midnight để kiểm tra overdue invoices.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void checkOverdueInvoices() {
        LocalDate today = LocalDate.now();
        List<Invoice> overdueInvoices = invoiceRepository
                .findByStatusAndDueDateBefore(InvoiceStatus.PENDING, today);
        
        int count = 0;
        for (Invoice invoice : overdueInvoices) {
            try {
                invoiceStateContext.markAsOverdue(invoice);
                invoiceRepository.save(invoice);
                count++;
                log.info("⚠️ [SCHEDULER] Invoice {} marked as OVERDUE", invoice.getId());
            } catch (Exception e) {
                log.error("❌ [SCHEDULER] Failed to mark invoice {} as overdue: {}", 
                        invoice.getId(), e.getMessage());
            }
        }
        
        log.info("✅ [SCHEDULER] Processed {} overdue invoices", count);
    }
}
