# Design Pattern & SOLID Review Report

**Project:** F4_FORUM - Spring Boot Backend  
**Date:** 2026-04-04  
**Scope:** 12 Design Patterns Analysis + SOLID Compliance

---

## 1. Executive Summary

### Overall Assessment

| Category | Score | Notes |
|----------|-------|-------|
| Pattern Coverage | 8/12 | Chỉ 8/12 patterns được áp dụng thực tế |
| Implementation Quality | 6.5/10 | Trung bình - có pattern tốt, có pattern cần cải thiện |
| SOLID Compliance | 5.5/10 | Nhiều violations, đặc biệt OCP và SRP |
| Dead Code | 25% | ~25% pattern implementations không được sử dụng |

### Pattern Summary Table

| # | Pattern | Status | Quality | Dead Code | SOLID Issues |
|---|---------|--------|---------|-----------|--------------|
| 1 | Singleton | ✅ Applied | 7/10 | ❌ | CommandHistory stateful |
| 2 | Factory | ⚠️ Partial | 5/10 | ❌ | OCP violations |
| 3 | Builder | ✅ Applied | 6/10 | ❌ | @Data + @Builder anti-pattern |
| 4 | Strategy | ⚠️ Partial | 6/10 | ❌ | 3 OCP violations |
| 5 | Observer | ✅ Applied | 6/10 | ✅ | Dead events |
| 6 | Decorator | ❌ Dead | 2/10 | ✅ | Dead code |
| 7 | Facade | ✅ Applied | 5/10 | ⚠️ | Code duplication |
| 8 | Adapter | ⚠️ Partial | 4/10 | ✅ | 67% dead code |
| 9 | Proxy | ⚠️ Implicit | 8/10 | ❌ | Không có manual |
| 10 | Template Method | ⚠️ Partial | 6/10 | ✅ | Unused design |
| 11 | State | ✅ Applied | 7/10 | ❌ | OCP violations |
| 12 | Command | ⚠️ Partial | 6.5/10 | ❌ | Undo incomplete |

---

## 2. Chi Tiết Từng Pattern

### 2.1 Singleton Pattern

**Status:** ✅ Applied (Spring-managed)

**Implementation:**
- **90+ Spring beans** sử dụng `@Component`, `@Service`, `@Repository` (Spring default singleton)
- **Không có manual singleton** implementation (`private constructor + getInstance()`)
- **Static final instances** trong State Pattern classes (EnrollmentStateContext, CourseStateContext)

**Code Example:**
```java
// Spring-managed singleton - appropriate
@Service
public class CourseQueryService {
    private final CourseRepository courseRepository;
    // Spring tự động tạo 1 instance duy nhất
}
```

**SOLID Assessment:**

| Principle | Status | Notes |
|-----------|--------|-------|
| SRP | ⚠️ Issue | CommandHistory lưu trữ mutable state |
| OCP | ✅ | Stateless services mở rộng tốt |
| DIP | ✅ | Phụ thuộc vào abstractions |

**Issues Found:**
1. **CommandHistory** - Singleton lưu trữ mutable state (history queue)
   ```java
   @Component
   public class CommandHistory {
       private final ConcurrentLinkedQueue<Command<?>> history = new ConcurrentLinkedQueue<>();
       private final Map<String, Command<?>> commandMap = new ConcurrentHashMap<>();
   }
   ```
   - Risk: Memory leak nếu không clear định kỳ
   - Recommendation: Sử dụng `@Scope("prototype")` hoặc tách storage riêng

**Recommendation:** 
- ✅ Sử dụng Spring singleton đúng cách
- ⚠️ Cải thiện CommandHistory để tránh memory issues

---

### 2.2 Factory Pattern

**Status:** ⚠️ Partial - 3 factories nhưng có OCP violations

**Implementation:**

| Factory | Location | OCP Compliance | Usage |
|---------|----------|----------------|-------|
| `DiscountStrategyFactory` | `entity/strategy/` | ✅ Good | Not used in Promotion |
| `CommandFactory` | `command/` | ⚠️ Partial | Limited |
| `UserFactory` | `service/factory/` | ❌ Poor | Used |

**Good Example - DiscountStrategyFactory:**
```java
@Component
public class DiscountStrategyFactory {
    private final Map<String, DiscountStrategy> strategies;
    
    public DiscountStrategyFactory(List<DiscountStrategy> strategyList) {
        this.strategies = strategyList.stream()
            .collect(Collectors.toMap(DiscountStrategy::getType, Function.identity()));
    }
}
```
- Sử dụng Spring DI để auto-discover strategies
- Thêm strategy mới không cần sửa factory

**Bad Example - UserFactory:**
```java
public User createUser(CreateUserCommand cmd) {
    return switch (cmd.userType()) {
        case STUDENT -> Student.builder()...build();    // ❌ OCP violation
        case TEACHER -> Teacher.builder()...build();   // ❌ OCP violation
        case STAFF -> StaffMember.builder()...build(); // ❌ OCP violation
        default -> throw new IllegalArgumentException(...);
    };
}
```
- Thêm user type mới phải sửa factory

**SOLID Issues:**

| Issue | Location | Severity |
|-------|----------|----------|
| OCP violation | UserFactory | HIGH |
| OCP violation | CommandFactory | MEDIUM |
| Not using factory | Promotion.java | HIGH |

**Recommendation:**
1. Refactor UserFactory theo DiscountStrategyFactory pattern
2. Sử dụng DiscountStrategyFactory trong Promotion.java

---

### 2.3 Builder Pattern

**Status:** ✅ Applied - Lombok @Builder

**Implementation:**

| Type | Files | Pattern Used |
|------|-------|--------------|
| Entities | 10+ | `@SuperBuilder(toBuilder = true)` ✅ |
| DTOs/Responses | 16+ | `@Data` + `@Builder` ⚠️ |
| Commands | 4+ | `@Data` + `@Builder` ⚠️ |

**Good Example - Entities:**
```java
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Invoice { ... }
```

**Anti-Pattern - DTOs:**
```java
// ❌ Anti-pattern: @Data + @Builder
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse { ... }
```

**Issues:**
1. **@Data generates setters** - Objects become mutable, defeating Builder purpose
2. **@AllArgsConstructor** - Creates dual construction paths
3. **No immutability** - DTOs should be immutable value objects

**Recommendation:**
```java
// ✅ Recommended - Value object pattern
@Value
@Builder
public class PromotionResponse {
    Long id;
    String code;
    // All fields are final
}
```

---

### 2.4 Strategy Pattern

**Status:** ⚠️ Partial - 3 nhóm Strategy, có OCP violations

**Implementations:**

| Strategy | Injection | Selection Method | OCP |
|----------|-----------|------------------|-----|
| AuthStrategy | List<AuthStrategy> | Stream filter | ✅ |
| ScheduleValidationStrategy | Direct DI | if-else on boolean | ❌ |
| DiscountStrategy | Via Factory | Factory lookup | ⚠️ |

**CRITICAL OCP Violations:**

**Violation #1 - Promotion.java:64-70**
```java
// ❌ Direct instantiation - OCP violation
if (discountType == DiscountType.PERCENT) {
    return new PercentDiscountStrategy()
        .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
} else if (discountType == DiscountType.FIXED) {
    return new FixedDiscountStrategy()
        .calculateWithValue(discountValue, baseAmount, maxDiscountAmount);
}
```

**Violation #2 - ScheduleService.java:48-49**
```java
// ❌ Hard-coded boolean selection
ScheduleValidationStrategy strategy = Boolean.TRUE.equals(command.getIsOnline()) 
    ? onlineStrategy : offlineStrategy;
```

**Violation #3 - DiscountStrategyFactory:63-69**
```java
// ❌ instanceof check
if (strategy instanceof PercentDiscountStrategy) {
    return ((PercentDiscountStrategy) strategy).calculateWithValue(...);
}
```

**SOLID Assessment:**
- OCP: ❌ 3 violations found
- DIP: ⚠️ Promotion depends on concrete classes

**Recommendation:**
1. Sử dụng DiscountStrategyFactory trong Promotion
2. Refactor ScheduleService sử dụng List<Strategy> + filter như AuthFacade

---

### 2.5 Observer Pattern

**Status:** ✅ Applied - Spring Events

**Implementation:**

| Event Type | Count | Publishers | Listeners |
|------------|-------|------------|-----------|
| Invoice Events | 2 | ✅ | ✅ |
| Enrollment Events | 2 | ❌ | ✅ (dead) |
| User Events | 2 | ❌ | ✅ (dead) |
| Course Events | 3 | ❌ | ✅ (dead) |
| Teacher Events | 5 | ❌ | ✅ (dead) |
| Login Event | 1 | ✅ | ✅ |

**Good Practice - Async Event Handling:**
```java
@Async
@EventListener
public void handleInvoiceCreated(InvoiceCreatedEvent event) {
    // Non-blocking
}
```

**Issues:**

1. **Dead Events** - Events có listeners nhưng không có publishers:
   - EnrollmentAddedEvent, EnrollmentDroppedEvent
   - UserCreatedEvent, UserUpdatedEvent
   - CourseCreatedEvent, CourseUpdatedEvent, CourseArchivedEvent
   - All Teacher events

2. **Inconsistent Patterns**:
   - LoginSuccessEvent extends ApplicationEvent (legacy)
   - Others are POJOs (modern)

3. **@Transactional on @Async** - May not work as expected in different thread

**Recommendation:**
- Implement event publishing cho missing events, HOẶC
- Remove dead event listeners

---

### 2.6 Decorator Pattern

**Status:** ❌ Dead Code

**Implementation Found:**
```
decorator/fee/
├── FeeCalculator.java (interface)
├── BaseFeeCalculator.java (concrete)
├── DiscountDecorator.java
├── RegistrationFeeDecorator.java
└── FeeCalculatorDemo.java
```

**Analysis:**
- **Không được sử dụng trong production**
- FeeCalculatorDemo chỉ là demo, không được inject
- Decorators không được mark là @Component

**Potential Applications (Not Used):**
1. Invoice calculation (TaxDecorator, PaymentMethodFeeDecorator)
2. Course fee calculation (SeasonalDiscountDecorator)
3. Payment processing (TransactionFeeDecorator)

**Recommendation:**
- Remove dead code, HOẶC
- Integrate vào production (Invoice calculation)

---

### 2.7 Facade Pattern

**Status:** ✅ Applied - 19 Facade classes

**Facades Found:**

| Package | Facades | Quality |
|---------|---------|---------|
| `facade/` | 5 | 3 good, 2 thin |
| `security/facade/` | 2 | 1 good, 1 thin |
| `service/` | 12 | Variable (duplication) |

**Good Implementation - StaffInvoiceFacade:**
```java
@Service
public class StaffInvoiceFacade {
    // Coordinates 5 repositories + State Pattern + Event Publishing
    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PromotionRepository promotionRepository;
    private final CourseRepository courseRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final InvoiceStateContext invoiceStateContext;
}
```

**CRITICAL ISSUE - Code Duplication:**

**Duplicated in 8 Teacher*Facades:**
```java
private Long resolveTeacherIdFromToken(String token) {
    String username = MockTokenUsernameExtractor.extractUsername(token);
    UserAccount account = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));
    if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
        throw new RuntimeException("Không có quyền!");
    }
    return account.getUser().getId();
}
```

**Thin Facades - No Value Added:**
```java
// StaffScheduleFacade - pure delegation
public List<ScheduleResponse> getSchedules(LocalDate start, LocalDate end) {
    return scheduleService.getSchedules(start, end);
}
```

**SOLID Issues:**
- SRP Violation: Teacher*Facades mix auth logic với business logic
- DIP Violation: Direct repository injection

**Recommendation:**
1. Use existing TeacherContextResolver (already exists but underutilized!)
2. Remove thin facades (StaffScheduleFacade, CourseFacade)
3. Refactor to proper Facade/Service layering

---

### 2.8 Adapter Pattern

**Status:** ⚠️ Partial - 3 adapters, 2 là dead code

**Implementation:**

| Adapter | Usage | Status |
|---------|-------|--------|
| NotificationAdapter | InvoiceEventListener | ✅ Active |
| PaymentGatewayAdapter | - | ❌ Dead |
| EmailServiceAdapter | - | ❌ Dead |

**Design Issues:**

1. **Type Safety - Map<String, Object> Parameters:**
```java
// ❌ No compile-time type checking
T call(Map<String, Object> params);

// Should be:
NotificationRequest call(NotificationRequest request);
```

2. **Liskov Substitution Violation:**
```java
// Different return types - cannot use interchangeably
ExternalServiceAdapter<Boolean> notifAdapter = new NotificationAdapter();
ExternalServiceAdapter<String> paymentAdapter = new PaymentGatewayAdapter();
```

**SOLID Issues:**
- ISP Violation: Interface forces all methods
- LSP Violation: Different return types

**Recommendation:**
1. Replace Map with strongly-typed DTOs
2. Separate interfaces by domain
3. Remove dead adapters hoặc implement actual usage

---

### 2.9 Proxy Pattern

**Status:** ⚠️ Implicit via Spring AOP

**Implementation:**

| Type | Count | Usage |
|------|-------|-------|
| @Transactional Proxy | 58 | Database transactions |
| @Cacheable Proxy | 4 | Redis caching |
| Custom AOP Aspects | 4 | Transaction, Performance, Logging |
| JPA/Repository Proxies | Implicit | Framework created |
| Manual Proxy | 0 | None |

**Good Practice - Spring AOP:**
```java
@Component
public class TransactionAspect {
    @Aspect
    @Component
    public class TransactionAspect {
        @Around("@annotation(Transactional)")
        public Object logTransaction(ProceedingJoinPoint joinPoint) {
            // Proxy pattern via Spring AOP
        }
    }
}
```

**Assessment:**
- ✅ Best practice - sử dụng Spring's built-in proxy mechanism
- ✅ Không có manual proxy (unnecessary complexity)
- ⚠️ Không có @Lazy proxies

**Recommendation:** Tiếp tục sử dụng Spring AOP, không cần manual proxies

---

### 2.10 Template Method Pattern

**Status:** ⚠️ Partial - 2 implementations, 1 unused

**Implementations:**

| Class | Usage | Quality |
|-------|-------|---------|
| AbstractCommand | Used by 3 commands | ✅ Good |
| AbstractTeacherWriteFacade | Not used | ⚠️ Design issue |
| AbstractValidationHandler | Not a true TM (CoR) | N/A |

**Good Example - AbstractCommand:**
```java
// Template Method - final, cannot be overridden
public final T execute() {
    return doExecute();
}

// Abstract - MUST implement
protected abstract T doExecute();

// Hooks - optional override
public void canUndo() { return false; }
```

**Issues:**

1. **AbstractTeacherWriteFacade - Design Problem:**
   - doExecute() không phải abstract - subclasses có thể không override
   - Class tồn tại nhưng không được sử dụng

2. **Two similar methods:**
   - executeWrite() và executeWriteWithResult() nearly identical - DRY violation

**Recommendation:**
1. Make doExecute() abstract trong AbstractTeacherWriteFacade
2. Remove duplicate methods

---

### 2.11 State Pattern

**Status:** ✅ Applied - 3 state machines

**Implementations:**

| Entity | States | Context | Quality |
|--------|--------|---------|---------|
| Invoice | 4 (Pending, Paid, Overdue, Cancelled) | Spring DI | ✅ Good |
| Enrollment | 3 (Active, Completed, Dropped) | Static final | ⚠️ Mixed |
| Course | 3 (Draft, Published, Archived) | Static final | ⚠️ Mixed |

**Good Example - InvoiceStateContext:**
```java
@Component
public class InvoiceStateContext {
    private final InvoicePendingState pendingState;
    private final InvoicePaidState paidState;
    private final InvoiceOverdueState overdueState;
    private final InvoiceCancelledState cancelledState;
}
```

**OCP Violations:**

**Violation #1 - Adding new state:**
```java
// Must modify context for new state
public InvoiceState getState(InvoiceStatus status) {
    return switch (status) {
        case PENDING -> pendingState;
        case PAID -> paidState;
        // Adding new state requires MODIFYING this method
    };
}
```

**Violation #2 - Hardcoded transitions:**
```java
// Penalty rate hardcoded
private static final BigDecimal PENALTY_RATE = new BigDecimal("0.05");
```

**Recommendation:**
1. Use configurable state machine (database-driven transitions)
2. Add @Version for optimistic locking

---

### 2.12 Command Pattern

**Status:** ⚠️ Partial - Interface tốt nhưng implementation incomplete

**Implementation:**

| Component | Count | Quality |
|-----------|-------|---------|
| Command Interface | 1 | ✅ Good |
| AbstractCommand | 1 | ✅ Good |
| Concrete Commands | 3 | ⚠️ Limited |
| CommandFactory | 1 | ⚠️ Basic |
| AsyncCommandExecutor | 1 | ✅ Good (virtual threads) |
| CommandHistory | 1 | ✅ Good |

**Structure:**
```java
public interface Command<T> {
    T execute();
    String getCommandName();
    Instant getTimestamp();
    String getCommandId();
    default void undo() { throw new UnsupportedOperationException(); }
    default boolean canUndo() { return false; }
}
```

**Issues:**

1. **Undo Capability - Incomplete:**
   - Only 1/3 commands implements undo (CreateCourseCommand)
   - No undo API endpoint

2. **Factory Extensibility:**
```java
// Hardcoded - OCP violation
return switch (commandType) {
    case "CREATE_INVOICE" -> createInvoiceCommand(...);
    case "PAY_INVOICE" -> payInvoiceCommand(...);
    // Adding new command requires MODIFYING this
};
```

3. **Limited Commands:**
   - Only invoice domain commands
   - No generic command registry

**Recommendation:**
1. Implement undo cho tất cả commands
2. Refactor factory sử dụng registry pattern

---

## 3. SOLID Violations Summary

| Pattern | Principle | Violation | Severity |
|---------|-----------|-----------|----------|
| Strategy | OCP | Promotion.java direct instantiation | HIGH |
| Strategy | OCP | ScheduleService boolean selection | MEDIUM |
| Strategy | OCP | DiscountStrategyFactory instanceof | MEDIUM |
| Factory | OCP | UserFactory hardcoded switch | HIGH |
| Factory | OCP | CommandFactory hardcoded switch | MEDIUM |
| Facade | SRP | Teacher*Facades auth + business mixed | HIGH |
| Facade | SRP | CommandHistory multiple responsibilities | MEDIUM |
| State | OCP | InvoiceStateContext hardcoded mapping | MEDIUM |
| State | OCP | State transitions hardcoded | MEDIUM |
| Adapter | LSP | Different return types | HIGH |
| Adapter | ISP | Forced method implementation | MEDIUM |
| Builder | Other | @Data + @Builder anti-pattern | MEDIUM |
| Decorator | - | Dead code | - |
| Observer | - | Dead event listeners | LOW |
| Singleton | SRP | CommandHistory stateful | LOW |

---

## 4. Recommended Improvements (Priority Order)

### HIGH Priority (Fix Now)

| # | Action | Pattern | Effort |
|---|--------|---------|--------|
| 1 | Use TeacherContextResolver in all Teacher*Facades | Facade | Low |
| 2 | Fix Promotion.java - use DiscountStrategyFactory | Strategy | Low |
| 3 | Replace @Data + @Builder with @Value | Builder | Medium |
| 4 | Remove/fix thin facades (StaffScheduleFacade) | Facade | Low |

### MEDIUM Priority (Plan Later)

| # | Action | Pattern | Effort |
|---|--------|---------|--------|
| 5 | Add undo to all Commands | Command | Medium |
| 6 | Add proper DTOs to Adapter interfaces | Adapter | Medium |
| 7 | Implement missing event publishing | Observer | Medium |
| 8 | Configurable state transitions | State | High |

### LOW Priority (Consider)

| # | Action | Pattern | Effort |
|---|--------|---------|--------|
| 9 | Remove dead decorator code | Decorator | Low |
| 10 | Fix AbstractTeacherWriteFacade | Template | Medium |
| 11 | Refactor factories to use registry | Factory | Medium |

---

## 5. Summary Statistics

| Metric | Value |
|--------|-------|
| Total Patterns | 12 |
| Applied in Production | 8 (67%) |
| Dead Code | 25% |
| OCP Violations | 7 |
| SRP Violations | 3 |
| LSP Violations | 1 |
| ISP Violations | 1 |

---

## 6. Conclusion

Dự án F4_FORUM cho thấy hiểu biết tốt về Design Patterns với nhiều implementations đúng cách (Singleton, Observer, State). Tuy nhiên, có một số vấn đề cần cải thiện:

**Strengths:**
- Spring Events + @Async implemented correctly
- State machines cho Invoice, Enrollment, Course
- CQRS pattern với query/command separation
- Spring AOP usage đúng cách

**Areas for Improvement:**
- Code duplication trong Teacher*Facades
- OCP violations trong Strategy và Factory
- Dead code (Decorator, some Adapters, some Events)
- Anti-pattern @Data + @Builder trong DTOs

**Overall: 6.5/10** - Dự án có nền tảng tốt nhưng cần refactoring để đạt SOLID compliance hoàn toàn.