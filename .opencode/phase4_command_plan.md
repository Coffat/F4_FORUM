# Phase 4: Command Pattern

## Mục tiêu
Đóng gói Request thành Object để dễ dàng xử lý, log, và thực thi bất đồng bộ (sử dụng Virtual Threads).

## Triển khai theo BE_SKILLS.md #12
> "Command: Đóng gói Request thành Object để dễ dàng xử lý, log, hoặc thực thi bất đồng bộ."

---

## Task 4.1: Tạo Command interface

### 4.1.1 Tạo Command interface
**File:** `backend/src/main/java/com/f4/forum/command/Command.java`

```java
package com.f4.forum.command;

public interface Command<T> {
    
    /**
     * Thực thi command.
     */
    T execute();
    
    /**
     * Lấy tên command.
     */
    String getCommandName();
    
    /**
     * Lấy timestamp khi command được tạo.
     */
    java.time.Instant getTimestamp();
    
    /**
     * Lấy ID của command.
     */
    String getCommandId();
}
```

---

## Task 4.2: Tạo Abstract Base Command

### 4.2.1 Tạo AbstractCommand
**File:** `backend/src/main/java/com/f4/forum/command/AbstractCommand.java`

```java
package com.f4.forum.command;

import java.time.Instant;
import java.util.UUID;

public abstract class AbstractCommand<T> implements Command<T> {
    
    private final Instant timestamp;
    private final String commandId;
    
    protected AbstractCommand() {
        this.timestamp = Instant.now();
        this.commandId = UUID.randomUUID().toString();
    }
    
    @Override
    public String getCommandName() {
        return this.getClass().getSimpleName();
    }
    
    @Override
    public Instant getTimestamp() {
        return timestamp;
    }
    
    @Override
    public String getCommandId() {
        return commandId;
    }
}
```

---

## Task 4.3: Tạo Invoice Commands

### 4.3.1 Tạo CreateInvoiceCommandHandler
**File:** `backend/src/main/java/com/f4/forum/command/invoice/CreateInvoiceCommandHandler.java`

```java
package com.f4.forum.command.invoice;

import com.f4.forum.command.AbstractCommand;
import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class CreateInvoiceCommandHandler extends AbstractCommand<InvoiceResponse> {

    private final StaffInvoiceFacade staffInvoiceFacade;
    private final CreateInvoiceCommand command;
    
    @Override
    public InvoiceResponse execute() {
        log.info("📨 [COMMAND] Executing CreateInvoiceCommand: {}", getCommandId());
        long startTime = System.currentTimeMillis();
        
        InvoiceResponse result = staffInvoiceFacade.createInvoice(command);
        
        long duration = System.currentTimeMillis() - startTime;
        log.info("📬 [COMMAND] CreateInvoiceCommand completed in {}ms", duration);
        
        return result;
    }
}
```

### 4.3.2 Tạo PayInvoiceCommandHandler
**File:** `backend/src/main/java/com/f4/forum/command/invoice/PayInvoiceCommandHandler.java`

```java
package com.f4.forum.command.invoice;

import com.f4.forum.command.AbstractCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;

@Slf4j
@RequiredArgsConstructor
public class PayInvoiceCommandHandler extends AbstractCommand<InvoiceResponse> {

    private final StaffInvoiceFacade staffInvoiceFacade;
    private final Long invoiceId;
    private final BigDecimal amount;
    
    @Override
    public InvoiceResponse execute() {
        log.info("📨 [COMMAND] Executing PayInvoiceCommand: {} for invoice {}", 
                getCommandId(), invoiceId);
        
        InvoiceResponse result = staffInvoiceFacade.payInvoice(invoiceId, amount);
        
        log.info("💰 [COMMAND] PayInvoiceCommand completed for invoice {}", invoiceId);
        return result;
    }
}
```

---

## Task 4.4: Tạo Command History

### 4.4.1 Tạo CommandHistory
**File:** `backend/src/main/java/com/f4/forum/command/CommandHistory.java`

```java
package com.f4.forum.command;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;

@Component
@Slf4j
public class CommandHistory {

    private static final int MAX_HISTORY_SIZE = 1000;
    private final ConcurrentLinkedQueue<Command<?>> history = new ConcurrentLinkedQueue<>();
    private final Map<String, Command<?>> commandMap = new ConcurrentHashMap<>();

    /**
     * Ghi nhận command vào history.
     */
    public void record(Command<?> command) {
        history.add(command);
        commandMap.put(command.getCommandId(), command);
        
        // Giới hạn kích thước
        while (history.size() > MAX_HISTORY_SIZE) {
            Command<?> oldest = history.poll();
            if (oldest != null) {
                commandMap.remove(oldest.getCommandId());
            }
        }
        
        log.debug("📝 [COMMAND HISTORY] Recorded: {} - {}", 
                command.getCommandName(), command.getCommandId());
    }

    /**
     * Lấy tất cả history.
     */
    public List<Command<?>> getHistory() {
        return Collections.unmodifiableList(history.stream().toList());
    }

    /**
     * Lấy history theo command name.
     */
    public List<Command<?>> getHistoryByName(String commandName) {
        return history.stream()
                .filter(c -> c.getCommandName().equals(commandName))
                .collect(Collectors.toList());
    }

    /**
     * Lấy command theo ID.
     */
    public Command<?> getCommand(String commandId) {
        return commandMap.get(commandId);
    }

    /**
     * Lấy history trong khoảng thời gian.
     */
    public List<Command<?>> getHistoryBetween(Instant start, Instant end) {
        return history.stream()
                .filter(c -> !c.getTimestamp().isBefore(start) && !c.getTimestamp().isAfter(end))
                .collect(Collectors.toList());
    }

    /**
     * Lấy số lượng commands trong history.
     */
    public int getHistorySize() {
        return history.size();
    }

    /**
     * Xóa history.
     */
    public void clear() {
        history.clear();
        commandMap.clear();
        log.info("🗑️ [COMMAND HISTORY] Cleared");
    }
}
```

---

## Task 4.5: Tạo Async Command Executor (Virtual Threads)

### 4.5.1 Tạo AsyncCommandExecutor
**File:** `backend/src/main/java/com/f4/forum/command/AsyncCommandExecutor.java`

```java
package com.f4.forum.command;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executors;

@Component
@RequiredArgsConstructor
@Slf4j
public class AsyncCommandExecutor {

    private final CommandHistory commandHistory;

    /**
     * Thực thi command bất đồng bộ sử dụng Virtual Threads (Java 21+).
     */
    public <T> CompletableFuture<T> executeAsync(Command<T> command) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("🚀 [ASYNC COMMAND] Starting: {} - {}", 
                        command.getCommandName(), command.getCommandId());
                
                T result = command.execute();
                
                // Ghi vào history sau khi thực hiện
                commandHistory.record(command);
                
                log.info("✅ [ASYNC COMMAND] Completed: {} - {}", 
                        command.getCommandName(), command.getCommandId());
                
                return result;
            } catch (Exception e) {
                log.error("❌ [ASYNC COMMAND] Failed: {} - {} - Error: {}", 
                        command.getCommandName(), command.getCommandId(), e.getMessage());
                throw new CompletionException(e);
            }
        }, Executors.newVirtualThreadPerTaskExecutor());
    }

    /**
     * Thực thi nhiều commands song song.
     */
    public <T> CompletableFuture<Void> executeAllAsync(List<Command<T>> commands) {
        List<CompletableFuture<T>> futures = commands.stream()
                .map(this::executeAsync)
                .collect(java.util.stream.Collectors.toList());
        
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
    }
}
```

---

## Task 4.6: Tạo Command Factory

### 4.6.1 Tạo CommandFactory
**File:** `backend/src/main/java/com/f4/forum/command/CommandFactory.java`

```java
package com.f4.forum.command;

import com.f4.forum.command.invoice.CreateInvoiceCommandHandler;
import com.f4.forum.command.invoice.PayInvoiceCommandHandler;
import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.facade.StaffInvoiceFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandFactory {

    private final StaffInvoiceFacade staffInvoiceFacade;

    /**
     * Tạo CreateInvoiceCommand.
     */
    public Command<?> createInvoiceCommand(CreateInvoiceCommand command) {
        return new CreateInvoiceCommandHandler(staffInvoiceFacade, command);
    }

    /**
     * Tạo PayInvoiceCommand.
     */
    public Command<?> payInvoiceCommand(Long invoiceId, BigDecimal amount) {
        return new PayInvoiceCommandHandler(staffInvoiceFacade, invoiceId, amount);
    }

    /**
     * Tạo command theo type.
     */
    public Command<?> createCommand(String commandType, Object... params) {
        return switch (commandType) {
            case "CREATE_INVOICE" -> createInvoiceCommand((CreateInvoiceCommand) params[0]);
            case "PAY_INVOICE" -> payInvoiceCommand(
                    (Long) params[0], 
                    (BigDecimal) params[1]
            );
            default -> throw new IllegalArgumentException("Unknown command type: " + commandType);
        };
    }
}
```

---

## Task 4.7: Tạo Command Logging Aspect

### 4.7.1 Tạo CommandLoggingAspect
**File:** `backend/src/main/java/com/f4/forum/aspect/CommandLoggingAspect.java`

```java
package com.f4.forum.aspect;

import com.f4.forum.command.Command;
import com.f4.forum.command.CommandHistory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class CommandLoggingAspect {

    private final CommandHistory commandHistory;

    /**
     * Log tất cả commands trong Facade layer.
     */
    @Around("execution(* com.f4.forum.facade..*.create*(..)) || " +
            "execution(* com.f4.forum.facade..*.update*(..)) || " +
            "execution(* com.f4.forum.facade..*.delete*(..))")
    public Object logCommand(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String commandType = className + "." + methodName;
        
        long startTime = System.currentTimeMillis();
        log.info("📨 [ASPECT COMMAND] Starting: {}", commandType);
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("📬 [ASPECT COMMAND] Completed: {} in {}ms", commandType, duration);
            
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("❌ [ASPECT COMMAND] Failed: {} in {}ms - Error: {}", 
                    commandType, duration, ex.getMessage());
            throw ex;
        }
    }
}
```

---

## Task 4.8: Tạo REST API cho Command Management

### 4.8.1 Tạo CommandController
**File:** `backend/src/main/java/com/f4/forum/controller/CommandController.java`

```java
package com.f4.forum.controller;

import com.f4.forum.command.AsyncCommandExecutor;
import com.f4.forum.command.Command;
import com.f4.forum.command.CommandFactory;
import com.f4.forum.command.CommandHistory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/commands")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Command Management", description = "APIs for command execution and history")
public class CommandController {

    private final CommandFactory commandFactory;
    private final AsyncCommandExecutor asyncCommandExecutor;
    private final CommandHistory commandHistory;

    @PostMapping("/execute")
    @Operation(summary = "Execute command synchronously")
    @ApiResponse(responseCode = "200", description = "Command executed successfully")
    public ResponseEntity<Map<String, Object>> executeCommand(
            @RequestParam String commandType,
            @RequestParam(required = false) Long invoiceId,
            @RequestParam(required = false) String amount) {
        
        Command<?> command = commandFactory.createCommand(
                commandType, 
                invoiceId, 
                amount != null ? new java.math.BigDecimal(amount) : null
        );
        
        Object result = command.execute();
        commandHistory.record(command);
        
        return ResponseEntity.ok(Map.of(
                "commandId", command.getCommandId(),
                "commandName", command.getCommandName(),
                "status", "COMPLETED",
                "result", result
        ));
    }

    @PostMapping("/execute-async")
    @Operation(summary = "Execute command asynchronously")
    @ApiResponse(responseCode = "202", description = "Command queued for execution")
    public ResponseEntity<Map<String, Object>> executeCommandAsync(
            @RequestParam String commandType,
            @RequestParam(required = false) Long invoiceId,
            @RequestParam(required = false) String amount) {
        
        Command<?> command = commandFactory.createCommand(
                commandType, 
                invoiceId, 
                amount != null ? new java.math.BigDecimal(amount) : null
        );
        
        // Execute async và return immediately
        asyncCommandExecutor.executeAsync(command);
        
        return ResponseEntity.accepted().body(Map.of(
                "commandId", command.getCommandId(),
                "commandName", command.getCommandName(),
                "status", "QUEUED",
                "message", "Command is being executed asynchronously"
        ));
    }

    @GetMapping("/history")
    @Operation(summary = "Get command history")
    @ApiResponse(responseCode = "200", description = "Command history retrieved")
    public ResponseEntity<List<Command<?>>> getHistory() {
        return ResponseEntity.ok(commandHistory.getHistory());
    }

    @GetMapping("/history/{commandId}")
    @Operation(summary = "Get specific command by ID")
    @ApiResponse(responseCode = "200", description = "Command found")
    public ResponseEntity<Command<?>> getCommand(@PathVariable String commandId) {
        Command<?> command = commandHistory.getCommand(commandId);
        if (command == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(command);
    }

    @DeleteMapping("/history")
    @Operation(summary = "Clear command history")
    @ApiResponse(responseCode = "200", description = "History cleared")
    public ResponseEntity<Map<String, String>> clearHistory() {
        commandHistory.clear();
        return ResponseEntity.ok(Map.of("status", "CLEARED"));
    }
}
```

---

## Tổng kết Phase 4

### Files tạo mới (10 files)
```
backend/src/main/java/com/f4/forum/command/
├── Command.java
├── AbstractCommand.java
├── CommandHistory.java
├── CommandFactory.java
├── AsyncCommandExecutor.java
└── invoice/
    ├── CreateInvoiceCommandHandler.java
    └── PayInvoiceCommandHandler.java

backend/src/main/java/com/f4/forum/aspect/
└── CommandLoggingAspect.java

backend/src/main/java/com/f4/forum/controller/
└── CommandController.java
```

### Files sửa đổi
- Không cần sửa files hiện tại (chỉ thêm mới)

### Dependencies cần thiết
- ✅ Đã có: Spring Web
- ✅ Đã có: Spring AOP (AspectJ)
- ✅ Đã có: Java 21+ (Virtual Threads)

### Kiểm tra sau khi triển khai
1. Gọi API execute command → kiểm tra log command
2. Gọi API execute-async → kiểm tra response ngay lập tức
3. Kiểm tra command history qua API
4. Virtual Threads hoạt động → kiểm tra thread logs

---

## Mapping với BE_SKILLS.md

| Tiêu chuẩn BE_SKILLS.md | Triển khai |
|-------------------------|------------|
| #12: Command Pattern | Command interface + AbstractCommand |
| #12: Đóng gói Request | CreateInvoiceCommandHandler, PayInvoiceCommandHandler |
| #12: Thực thi bất đồng bộ | AsyncCommandExecutor với Virtual Threads |
| #12: Log commands | CommandHistory + CommandLoggingAspect |
| #6: Proxy (AOP) | CommandLoggingAspect |

---

## So sánh trước/sau

### Trước khi dùng Command Pattern:
```java
// Direct call - khó log, khó async
public InvoiceResponse createInvoice(CreateInvoiceCommand command) {
    return staffInvoiceFacade.createInvoice(command);
}
```

### Sau khi dùng Command Pattern:
```java
// Command Pattern - dễ log, dễ async
Command<?> command = commandFactory.createInvoiceCommand(command);
asyncCommandExecutor.executeAsync(command);
commandHistory.record(command);
```

---

## Tổng kết toàn bộ dự án

### Files tạo mới theo phases:

| Phase | Pattern | Files mới | Priority |
|-------|---------|-----------|----------|
| 1 | Observer | 3 | Cao |
| 2 | Caching | 2 | Cao |
| 3 | State | 7 | Trung bình |
| 4 | Command | 10 | Thấp |

### Tổng: 22 files mới

### Các dependencies thêm:
- `spring-boot-starter-data-redis`
- `spring-boot-starter-cache`

### Files sửa:
- `pom.xml` (2 dependencies)
- `StaffInvoiceFacade.java` (Observer + State integration)
- `CourseQueryService.java` (@Cacheable)
- `StaffClassFacade.java` (@Cacheable)
- `F4ForumApplication.java` (@EnableScheduling)
- `application.properties` (Redis config)

---

## Kết thúc dự án triển khai Design Patterns

Sau khi hoàn thành tất cả các phases, codebase sẽ tuân thủ đầy đủ các tiêu chuẩn từ `BE_SKILLS.md`:

1. ✅ Singleton - Spring IoC
2. ✅ Factory Method - DiscountStrategyFactory
3. ✅ Builder - Lombok @Builder
4. ✅ Facade - Staff*Facade
5. ✅ Adapter - NotificationAdapter
6. ✅ Proxy (AOP) - Logging, Performance, Transaction, **Caching**
7. ✅ Decorator - FeeCalculator
8. ✅ Strategy - DiscountStrategy
9. ✅ Observer - **InvoiceEventListener** (Spring Events)
10. ✅ State - **InvoiceState** (đúng nghĩa)
11. ✅ Template Method - BaseEntity
12. ✅ Command - **Command Pattern hoàn chỉnh**
