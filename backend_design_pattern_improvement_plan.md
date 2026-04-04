# 🎯 Kế Hoạch Áp Dụng Design Patterns - F4_FORUM Backend

## Tổng Quan

Áp dụng đầy đủ 5 Design Patterns còn thiếu theo BE_SKILLS.md:

---

## 1. Command Pattern (Cải thiện) - Priority: HIGH

### Mục tiêu
Chuyển Command DTOs thành true Command objects với execute() và undo() methods.

### Files cần tạo:
- `command/Command.java` - Interface với execute() và undo()
- `command/AbstractCommand.java` - Abstract base class
- `command/TeacherCommandExecutor.java` - Command Handler

---

## 2. State Pattern - Priority: HIGH

### Mục tiêu
Quản lý vòng đời phức tạp của Course và Enrollment qua các class trạng thái riêng biệt.

### Files cần tạo:
- `state/course/CourseState.java` - Interface
- `state/course/DraftState.java`
- `state/course/PublishedState.java`
- `state/course/ArchivedState.java`

---

## 3. Adapter Pattern - Priority: HIGH

### Mục tiêu
Wrap tất cả external services để bảo vệ lõi hệ thống.

### Files cần tạo:
- `adapter/ExternalServiceAdapter.java` - Interface chung
- `adapter/EmailServiceAdapter.java`
- `adapter/PaymentGatewayAdapter.java`
- `adapter/NotificationAdapter.java`

---

## 4. Proxy Pattern (Spring AOP) - Priority: MEDIUM

### Mục tiêu
Tạo aspects cho logging, caching, transaction monitoring.

### Files cần tạo:
- `aspect/LoggingAspect.java`
- `aspect/PerformanceAspect.java`

---

## 5. Decorator Pattern - Priority: LOW

### Mục tiêu
Thêm tính năng động như phí, thuế, giảm giá.

### Files cần tạo:
- `decorator/fee/FeeCalculator.java` - Interface
- `decorator/fee/BaseFeeCalculator.java`
- `decorator/fee/TaxDecorator.java`
- `decorator/fee/DiscountDecorator.java`

---

## Thứ tự thực hiện

1. Command Pattern → 2. State Pattern → 3. Adapter Pattern → 4. Proxy Pattern → 5. Decorator Pattern