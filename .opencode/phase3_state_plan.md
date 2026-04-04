# Phase 3: State Pattern

## Mục tiêu
Quản lý vòng đời phức tạp của Invoice qua các Class trạng thái riêng biệt thay vì chỉ dùng enum + setter.

## Triển khai theo BE_SKILLS.md #10
> "State: Quản lý vòng đời phức tạp của đối tượng qua các Class trạng thái riêng biệt."

---

## Task 3.1: Kiểm tra InvoiceStatus enum

### 3.1.1 Xem InvoiceStatus hiện tại
**File:** `backend/src/main/java/com/f4/forum/entity/enums/InvoiceStatus.java`

```java
public enum InvoiceStatus {
    PENDING,
    PAID,
    OVERDUE,
    CANCELLED,
    REFUNDED
}
```

---

## Task 3.2: Tạo InvoiceState interface

### 3.2.1 Tạo InvoiceState interface
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoiceState.java`

```java
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
```

---

## Task 3.3: Tạo các Concrete States

### 3.3.1 Tạo InvoicePendingState
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoicePendingState.java`

```java
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
```

### 3.3.2 Tạo InvoicePaidState
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoicePaidState.java`

```java
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
```

### 3.3.3 Tạo InvoiceOverdueState
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoiceOverdueState.java`

```java
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
```

### 3.3.4 Tạo InvoiceCancelledState
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoiceCancelledState.java`

```java
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
```

---

## Task 3.4: Tạo InvoiceStateContext

### 3.4.1 Tạo InvoiceStateContext
**File:** `backend/src/main/java/com/f4/forum/state/invoice/InvoiceStateContext.java`

```java
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
```

---

## Task 3.5: Tích hợp State Pattern vào StaffInvoiceFacade

### 3.5.1 Cập nhật StaffInvoiceFacade
**File:** `backend/src/main/java/com/f4/forum/facade/StaffInvoiceFacade.java`

**Thêm import:**
```java
import com.f4.forum.state.invoice.InvoiceStateContext;
```

**Thêm dependency:**
```java
private final InvoiceStateContext invoiceStateContext;
```

**Thêm method payInvoice:**
```java
/**
 * Thanh toán hóa đơn sử dụng State Pattern.
 */
@Transactional
public InvoiceResponse payInvoice(Long invoiceId, BigDecimal amount) {
    log.info("Processing payment for invoice ID: {}, amount: {}", invoiceId, amount);
    
    Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
    
    // Sử dụng State Pattern để xử lý thanh toán
    if (!invoiceStateContext.canPay(invoice)) {
        throw new IllegalStateException("Cannot pay invoice in current state: " + invoice.getStatus());
    }
    
    invoiceStateContext.pay(invoice, amount);
    Invoice savedInvoice = invoiceRepository.save(invoice);
    
    // Publish event cho notification
    eventPublisher.publishEvent(new InvoicePaidEvent(
            savedInvoice.getId(),
            "INV-" + String.format("%06d", savedInvoice.getId()),
            savedInvoice.getStudent().getId(),
            savedInvoice.getStudent().getFullName(),
            amount
    ));
    
    log.info("Invoice {} paid successfully via State Pattern", invoiceId);
    return mapToResponse(savedInvoice);
}

/**
 * Hủy hóa đơn sử dụng State Pattern.
 */
@Transactional
public InvoiceResponse cancelInvoice(Long invoiceId) {
    log.info("Cancelling invoice ID: {}", invoiceId);
    
    Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
    
    if (!invoiceStateContext.canCancel(invoice)) {
        throw new IllegalStateException("Cannot cancel invoice in current state: " + invoice.getStatus());
    }
    
    invoiceStateContext.cancel(invoice);
    Invoice savedInvoice = invoiceRepository.save(invoice);
    
    log.info("Invoice {} cancelled successfully via State Pattern", invoiceId);
    return mapToResponse(savedInvoice);
}
```

---

## Task 3.6: Tạo Scheduled Task cho Overdue

### 3.6.1 Kiểm tra F4ForumApplication
**File:** `backend/src/main/java/com/f4/forum/F4ForumApplication.java`

**Thêm @EnableScheduling:**
```java
@SpringBootApplication
@EnableScheduling
public class F4ForumApplication {
    public static void main(String[] args) {
        SpringApplication.run(F4ForumApplication.class, args);
    }
}
```

### 3.6.2 Tạo InvoiceScheduler
**File:** `backend/src/main/java/com/f4/forum/scheduler/InvoiceScheduler.java`

```java
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
```

### 3.6.3 Thêm method vào InvoiceRepository
**File:** `backend/src/main/java/com/f4/forum/repository/InvoiceRepository.java`

```java
package com.f4.forum.repository;

import com.f4.forum.entity.Invoice;
import com.f4.forum.entity.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    List<Invoice> findByStatusAndDueDateBefore(InvoiceStatus status, LocalDate date);
    
    List<Invoice> findByStudentId(Long studentId);
    
    List<Invoice> findByStatus(InvoiceStatus status);
}
```

---

## Tổng kết Phase 3

### Files tạo mới (7 files)
```
backend/src/main/java/com/f4/forum/state/invoice/
├── InvoiceState.java
├── InvoicePendingState.java
├── InvoicePaidState.java
├── InvoiceOverdueState.java
├── InvoiceCancelledState.java
└── InvoiceStateContext.java

backend/src/main/java/com/f4/forum/scheduler/
└── InvoiceScheduler.java
```

### Files sửa đổi (3 files)
```
backend/src/main/java/com/f4/forum/F4ForumApplication.java
backend/src/main/java/com/f4/forum/facade/StaffInvoiceFacade.java
backend/src/main/java/com/f4/forum/repository/InvoiceRepository.java
```

### Dependencies cần thiết
- ✅ Đã có: Spring Scheduling (`@EnableScheduling`)
- ✅ Đã có: Transaction management

### Kiểm tra sau khi triển khai
1. Thanh toán invoice → kiểm tra chuyển sang PAID state
2. Hủy invoice → kiểm tra chuyển sang CANCELLED state
3. Test canPay/canCancel trước khi thực hiện
4. Scheduler chạy đúng → kiểm tra log

---

## Mapping với BE_SKILLS.md

| Tiêu chuẩn BE_SKILLS.md | Triển khai |
|-------------------------|------------|
| #10: State Pattern | InvoiceState interface + 4 Concrete States |
| #10: Class trạng thái riêng biệt | Pending/Paid/Overdue/Cancelled States |
| #4: Facade điều phối | StaffInvoiceFacade |
| #4: Rich Domain Model | Invoice entity |

---

## So sánh trước/sau

### Trước khi dùng State Pattern:
```java
// Simple State - không có business logic
public void setStatus(InvoiceStatus status) {
    this.status = status;
}
```

### Sau khi dùng State Pattern:
```java
// State Pattern - có validation và business logic
public void pay(Invoice invoice, BigDecimal amount) {
    if (amount.compareTo(invoice.getFinalAmount()) >= 0) {
        invoice.setStatus(InvoiceStatus.PAID);
        // Gửi notification, log, etc.
    }
}
```

---

## Next Step
**Phase 4: Command Pattern** → Tiếp theo sau khi hoàn thành Phase 3
