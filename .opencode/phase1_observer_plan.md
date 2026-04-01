# Phase 1: Observer Pattern (Spring Events)

## Mục tiêu
Xử lý các tác vụ phụ (side-effects) sau khi transaction MySQL thành công:
- Gửi notification sau khi tạo Invoice
- Sync data khi có thay đổi quan trọng

## Triển khai theo BE_SKILLS.md #9
> "Observer: Dùng Spring Events để xử lý các tác vụ phụ (Side-effects) sau khi Transaction MySQL thành công."

---

## Task 1.1: Tạo Event classes cho Invoice

### 1.1.1 Tạo InvoiceCreatedEvent
**File:** `backend/src/main/java/com/f4/forum/event/invoice/InvoiceCreatedEvent.java`

```java
package com.f4.forum.event.invoice;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@RequiredArgsConstructor
public class InvoiceCreatedEvent {
    private final Long invoiceId;
    private final String invoiceCode;
    private final Long studentId;
    private final String studentName;
    private final String studentEmail;
    private final BigDecimal finalAmount;
    private final LocalDate dueDate;
}
```

### 1.1.2 Tạo InvoicePaidEvent
**File:** `backend/src/main/java/com/f4/forum/event/invoice/InvoicePaidEvent.java`

```java
package com.f4.forum.event.invoice;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Getter
@RequiredArgsConstructor
public class InvoicePaidEvent {
    private final Long invoiceId;
    private final String invoiceCode;
    private final Long studentId;
    private final String studentName;
    private final BigDecimal amountPaid;
}
```

---

## Task 1.2: Cập nhật StaffInvoiceFacade để publish events

### 1.2.1 Thêm ApplicationEventPublisher
**File:** `backend/src/main/java/com/f4/forum/facade/StaffInvoiceFacade.java`

**Thêm import:**
```java
import org.springframework.context.ApplicationEventPublisher;
import com.f4.forum.event.invoice.InvoiceCreatedEvent;
import com.f4.forum.event.invoice.InvoicePaidEvent;
```

**Thêm field:**
```java
private final ApplicationEventPublisher eventPublisher;
```

### 1.2.2 Sửa method createInvoice
**Tìm đoạn code sau khi save invoice:**
```java
// 6. Lưu vào DB
Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);
log.info("Invoice created with ID: {}, base: {}, final: {}", 
        savedInvoice.getId(), savedInvoice.getBaseAmount(), savedInvoice.getFinalAmount());

// 6. Map to response
return mapToResponse(savedInvoice);
```

**Thay bằng:**
```java
// 6. Lưu vào DB
Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);
log.info("Invoice created with ID: {}, base: {}, final: {}", 
        savedInvoice.getId(), savedInvoice.getBaseAmount(), savedInvoice.getFinalAmount());

// 7. Publish event sau khi transaction thành công
eventPublisher.publishEvent(new InvoiceCreatedEvent(
        savedInvoice.getId(),
        "INV-" + String.format("%06d", savedInvoice.getId()),
        savedInvoice.getStudent().getId(),
        savedInvoice.getStudent().getFullName(),
        savedInvoice.getStudent().getEmail(),
        savedInvoice.getFinalAmount(),
        savedInvoice.getDueDate()
));

// 8. Map to response
return mapToResponse(savedInvoice);
```

---

## Task 1.3: Tạo InvoiceEventListener

### 1.3.1 Tạo InvoiceEventListener với @TransactionalEventListener
**File:** `backend/src/main/java/com/f4/forum/event/invoice/InvoiceEventListener.java`

```java
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
        
        // Gửi notification qua Adapter
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
        
        // Gửi notification xác nhận thanh toán
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
```

---

## Task 1.4: Thêm method payInvoice có publish event

### 1.4.1 Thêm method payInvoice vào StaffInvoiceFacade
**Thêm method mới vào StaffInvoiceFacade:**

```java
/**
 * Thanh toán hóa đơn.
 * Publish InvoicePaidEvent sau khi thanh toán thành công.
 */
@Transactional
public InvoiceResponse payInvoice(Long invoiceId, BigDecimal amount) {
    log.info("Processing payment for invoice ID: {}, amount: {}", invoiceId, amount);
    
    Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
    
    // Kiểm tra số tiền
    if (amount.compareTo(invoice.getFinalAmount()) < 0) {
        throw new IllegalArgumentException("Insufficient payment amount. Required: " + invoice.getFinalAmount());
    }
    
    // Cập nhật status
    invoice.markAsPaid();
    Invoice savedInvoice = invoiceRepository.save(invoice);
    
    // Publish event
    eventPublisher.publishEvent(new InvoicePaidEvent(
            savedInvoice.getId(),
            "INV-" + String.format("%06d", savedInvoice.getId()),
            savedInvoice.getStudent().getId(),
            savedInvoice.getStudent().getFullName(),
            amount
    ));
    
    log.info("Invoice {} paid successfully", invoiceId);
    return mapToResponse(savedInvoice);
}
```

---

## Task 1.5: Cập nhật GlobalEventListener (nếu cần)

### 1.5.1 Kiểm tra GlobalEventListener hiện tại
**File:** `backend/src/main/java/com/f4/forum/event/GlobalEventListener.java`

**Thêm các methods xử lý Invoice events (logging thay vì xử lý chính):**

```java
@Async
@EventListener
public void handleInvoiceCreated(InvoiceCreatedEvent event) {
    log.info("📄 [GLOBAL LISTENER] Invoice created event received: {}", event.getInvoiceCode());
}

@Async
@EventListener
public void handleInvoicePaid(InvoicePaidEvent event) {
    log.info("💰 [GLOBAL LISTENER] Invoice paid event received: {}", event.getInvoiceCode());
}
```

---

## Tổng kết Phase 1

### Files tạo mới (3 files)
```
backend/src/main/java/com/f4/forum/event/invoice/
├── InvoiceCreatedEvent.java
├── InvoicePaidEvent.java
└── InvoiceEventListener.java
```

### Files sửa đổi (1 file)
```
backend/src/main/java/com/f4/forum/facade/StaffInvoiceFacade.java
```

### Dependencies cần thiết
- ✅ Đã có: Spring Events (`ApplicationEventPublisher`)
- ✅ Đã có: `NotificationAdapter`
- ✅ Đã có: `@Async` trong `AsyncConfig`

### Kiểm tra sau khi triển khai
1. Tạo invoice mới → kiểm tra log có "Invoice created event received"
2. Thanh toán invoice → kiểm tra log có "Invoice paid event received"  
3. Kiểm tra notification được gửi (log từ NotificationAdapter)

---

## Mapping với BE_SKILLS.md

| Tiêu chuẩn BE_SKILLS.md | Triển khai |
|-------------------------|------------|
| #4: Điểm chạm duy nhất → Facade | StaffInvoiceFacade |
| #4: Sau Commit thành công → Observer | @TransactionalEventListener(AFTER_COMMIT) |
| #4: Thông báo qua Adapter | NotificationAdapter |
| #6: Proxy (AOP) | @Async cho event listener |
| #9: Observer Pattern | InvoiceEventListener |

---

## Next Step
**Phase 2: Caching Proxy (Redis)** → Tiếp theo sau khi hoàn thành Phase 1
