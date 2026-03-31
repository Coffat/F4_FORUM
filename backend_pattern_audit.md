## Tổng quan

- **Mục tiêu**:
  - Liệt kê các design/architecture pattern hiện đang được dùng trong backend (Java/Spring), kèm chú thích ngắn và ví dụ file.
  - Đối chiếu các pattern/yêu cầu ở `BE_SKILLS.md` mục 4 (pipeline “WOW”: Command → Facade → Chain of Responsibility → Factory/Strategy → Decorator/Proxy → Core Domain → @Transactional → Observer via Adapter) với các luồng Teacher write APIs, để chỉ ra “khoảng trống” hợp lý.
- **Phạm vi**: Backend Java/Spring, tập trung vào các facade Teacher và các phần liên quan auth/events.

---

## 1. Design / Architecture Patterns đang được dùng

### 1.1 Command

**Ý nghĩa**: Đóng gói dữ liệu request thành một object bất biến (`record` hoặc class) để truyền qua các tầng, thuận tiện cho logging, validation, extensibility.

**Ví dụ tiêu biểu**:

- Teacher module:
  - `backend/src/main/java/com/f4/forum/dto/request/CreateTeacherAssignmentCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherAssignmentCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/CreateTeacherMaterialCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherMaterialCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherAttendanceCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherGradesCommand.java`
- Branch/Course/User:
  - `backend/src/main/java/com/f4/forum/dto/BranchCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/CreateCourseCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateCourseCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/CreateUserCommand.java`
  - `backend/src/main/java/com/f4/forum/dto/request/UpdateUserCommand.java`

**Nhận xét**: Phần “Command” trong pipeline mục 4 đã được áp dụng khá rộng, đặc biệt cho các use case Teacher và quản trị.

---

### 1.2 Facade (Module Entry Point)

**Ý nghĩa**: Tạo “điểm chạm duy nhất” cho mỗi module. Controller chỉ gọi Facade, mọi phối hợp repository/service khác được ẩn phía sau.

**Ví dụ Teacher module**:

- `backend/src/main/java/com/f4/forum/service/TeacherProfileFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherOverviewFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherClassesFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherStudentFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherAssignmentFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherMaterialFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherAttendanceFacade.java`
- `backend/src/main/java/com/f4/forum/service/TeacherGradesFacade.java`

Các facade này thường:

- Parse/resolve user từ token (qua `MockTokenUsernameExtractor` + `UserAccountRepository`).
- Check quyền (ROLE_TEACHER / ROLE_ADMIN).
- Gọi repository tương ứng và map sang DTO.

**Ví dụ module khác**:

- Auth:
  - `backend/src/main/java/com/f4/forum/security/facade/AuthFacade.java`
- Course:
  - `backend/src/main/java/com/f4/forum/security/facade/CourseFacade.java`
- Staff Dashboard:
  - `backend/src/main/java/com/f4/forum/service/StaffDashboardFacade.java`

**Controller sử dụng Facade**:

- `backend/src/main/java/com/f4/forum/controller/TeacherController.java`
- `backend/src/main/java/com/f4/forum/controller/AuthController.java`
- `backend/src/main/java/com/f4/forum/controller/StaffDashboardController.java`

**Nhận xét**: Phần “Facade” trong pipeline mục 4 được hiện thực rất rõ ràng. Controller đều mỏng, không chứa nghiệp vụ.

---

### 1.3 Builder

**Ý nghĩa**: Tạo các object domain/DTO phức tạp một cách an toàn, dễ đọc, và có khả năng immutable hơn.

**Ví dụ**:

- Entities với Lombok `@SuperBuilder`:
  - `backend/src/main/java/com/f4/forum/entity/Assignment.java`
  - `backend/src/main/java/com/f4/forum/entity/Material.java`
  - `backend/src/main/java/com/f4/forum/entity/Attendance.java`
  - `backend/src/main/java/com/f4/forum/entity/Result.java`
  - `backend/src/main/java/com/f4/forum/entity/Branch.java` (còn dùng `@Builder.Default` cho list rooms)
  - `backend/src/main/java/com/f4/forum/entity/Student.java`, `Teacher.java`, `User.java`, `Enrollment.java`, v.v.
- DTO dùng `@Builder`:
  - Các inner DTO như `StaffDashboardMetricsResponse.RecentStaffEntry` được build trong `StaffDashboardFacade`.

**Nhận xét**: Builder được dùng rộng rãi cho domain model và một số DTO, đúng với yêu cầu “Builder cho object phức tạp”.

---

### 1.4 Factory (Factory Method / Type-based Initialization)

**Ý nghĩa**: Tạo object cụ thể dựa trên một tham số “type”, tránh if-else rải rác trong nhiều nơi.

**Ví dụ chính**:

- `backend/src/main/java/com/f4/forum/service/factory/UserFactory.java`
  - Chọn `Student` / `Teacher` / `StaffMember` dựa trên `cmd.userType()` với cú pháp `switch`.
- `backend/src/main/java/com/f4/forum/service/UserCommandService.java`
  - Sử dụng `UserFactory` để tạo đúng loại user khi thực thi `CreateUserCommand`.

**Nhận xét**: Có Factory rõ ràng cho `User`. Các chỗ khác (Teacher module) hiện chưa dùng Factory một cách hệ thống để chọn Strategy/implementation.

---

### 1.5 Strategy

**Ý nghĩa**: Định nghĩa một interface chung cho nhiều thuật toán, chọn implementation phù hợp ở runtime.

**Ví dụ Authentication**:

- `backend/src/main/java/com/f4/forum/security/strategy/AuthStrategy.java`
  - Interface với `supports(authType)` và `authenticate(LoginRequest request)`.
- `backend/src/main/java/com/f4/forum/security/strategy/UsernamePasswordAuthStrategy.java`
  - Implementation cho `LOCAL` login.
- `backend/src/main/java/com/f4/forum/security/facade/AuthFacade.java`
  - Nhận list `AuthStrategy`, chọn chiến lược phù hợp qua:
    - `strategies.stream().filter(s -> s.supports(authType)).findFirst()...`

**Nhận xét**: Strategy đã áp dụng chuẩn chỉnh cho module Auth, đúng tinh thần mục 3.8 trong `BE_SKILLS.md`.

---

### 1.6 Observer (Domain Events / Spring Events)

**Ý nghĩa**: Bắn sự kiện sau khi core logic hoàn tất, các listener tách biệt xử lý side-effects (notify, logging, update metadata, ...).

**Ví dụ chi nhánh (Branch)**:

- `backend/src/main/java/com/f4/forum/service/BranchService.java`
  - Sử dụng `ApplicationEventPublisher` để publish `BranchStatusChangedEvent` nếu status thay đổi trong `update(...)`.
- `backend/src/main/java/com/f4/forum/event/BranchStatusChangedEvent.java`
  - Định nghĩa event kèm `branchId`, `branchName`, `oldStatus`, `newStatus`.
- `backend/src/main/java/com/f4/forum/event/BranchEventListener.java`
  - `@Component`, `@Async`, `@EventListener`
  - Lắng nghe `BranchStatusChangedEvent` và log lại (mở đường để gửi email/notification).

**Ví dụ authentication**:

- `backend/src/main/java/com/f4/forum/security/facade/AuthFacade.java`
  - Sau khi login thành công, publish `LoginSuccessEvent`.
- `backend/src/main/java/com/f4/forum/security/event/LoginSuccessEvent.java`
  - Định nghĩa event (username).
- `backend/src/main/java/com/f4/forum/security/event/LoginEventListener.java`
  - `@EventListener`, `@Async`, `@Transactional`
  - Hậu xử lý: cập nhật `lastLogin` cho `UserAccount`.

**Nhận xét**: Observer pattern đã được dùng chuẩn mực cho Branch và Login, phù hợp với bước 8 của pipeline (Observer sau commit).

---

### 1.7 Proxy (Spring Proxy / AOP)

**Ý nghĩa**: Cross-cutting concerns (transaction, async) được xử lý qua proxy do Spring bọc quanh beans.

**Biểu hiện trong code**:

- `@Transactional` trên các facade/service:
  - `TeacherAssignmentFacade`, `TeacherMaterialFacade`, `TeacherAttendanceFacade`, `TeacherGradesFacade`, `UserCommandService`, `CourseCommandService`, `BranchService`, …
  - Comment trong `StaffDashboardFacade` mô tả rõ: 
    - `@Transactional(readOnly = true) được Spring Proxy bọc ngoài tất cả các method`.
- `@Async` + `@EnableAsync`:
  - `backend/src/main/java/com/f4/forum/config/AsyncConfig.java` (`@EnableAsync`)
  - `backend/src/main/java/com/f4/forum/event/BranchEventListener.java` (`@Async`)
  - `backend/src/main/java/com/f4/forum/security/event/LoginEventListener.java` (`@Async`)

**Nhận xét**: Proxy pattern được dùng gián tiếp qua Spring AOP, đúng phần “Proxy cho cross-cutting (logging, transaction, async)”.

---

### 1.8 Adapter (Converter / Boundary Layer)

**Ý nghĩa**: Bọc hoặc chuyển đổi dữ liệu từ “thế giới ngoài” (token, DTO, API) sang mô hình nội bộ.

**Ví dụ**:

- `backend/src/main/java/com/f4/forum/security/util/MockTokenUsernameExtractor.java`
  - Tách `username` từ chuỗi token mock, che giấu format thật của token khỏi domain.
- `backend/src/main/java/com/f4/forum/mapper/CourseMapper.java`
  - Chuyển đổi `Course` entity sang `CourseDTO` để giao tiếp với frontend.

**Nhận xét**: Có “mùi” Adapter, tuy chưa được formal hóa thành interface Adapter. Phù hợp với việc bảo vệ domain khỏi chi tiết representation/token format.

---

### 1.9 Rich Domain Model & (Lightweight) State

**Ý nghĩa**: Entity không chỉ có getter/setter mà chứa luôn logic nghiệp vụ.

**Ví dụ**:

- `backend/src/main/java/com/f4/forum/entity/Assignment.java`
  - `updateBasics(...)` kiểm tra title/description/maxScore, validate tương đối đầy đủ.
- `backend/src/main/java/com/f4/forum/entity/Material.java`
  - `updateBasics(...)` xử lý title, description, fileUrl, cập nhật `uploadDate`.
- `backend/src/main/java/com/f4/forum/entity/Attendance.java`
  - Có behavior `markPresent(...)`, `markAbsent(...)`.
- `backend/src/main/java/com/f4/forum/entity/Result.java`
  - `updateScores(...)` cập nhật điểm/grade/comment.
- `backend/src/main/java/com/f4/forum/entity/Enrollment.java`
  - `dropCourse()`, `complete()` thay đổi `EnrollmentStatus` có kiểm tra.
- `backend/src/main/java/com/f4/forum/entity/Branch.java`
  - `updateOperationalInfo(...)`, `changeStatus(...)`, `updateCapacity(...)`, `incrementEnrollment()`, `addRoom(...)`, `removeRoom(...)`.

**Nhận xét**: Domain model khá “rich”, đúng định hướng chống anemic model trong `BE_SKILLS.md`. 
Pattern State “đúng chuẩn” (có nhiều state class) chưa được dùng, nhưng state transitions bằng enum được encapsulate trong entity.

---

### 1.10 Những pattern **chưa thấy dấu hiệu rõ ràng**

- **Chain of Responsibility**: không có cấu trúc handler/next/chain riêng (mặc dù validation nằm trong facade & entity).
- **Decorator**: không có lớp decorator bao quanh service/strategy; cross-cutting đang được xử lý bởi Spring proxy (`@Transactional`, `@Async`).
- **Template Method**: không thấy abstract class định nghĩa khung thuật toán với các hook method cụ thể.
- **State Pattern “đầy đủ”**: chỉ có state transitions trong entity, chưa có family class `*State`.

---

## 2. Đối chiếu với `BE_SKILLS.md` mục 4 (Pipeline “WOW”) cho Teacher write APIs

Pipeline “WOW” (mục 4) gồm:

1. **Phân tích đầu vào**: Map Request thành Command object.
2. **Điểm chạm duy nhất**: Đưa Command vào Facade để điều phối.
3. **Màng lọc điều kiện**: Dùng Chain of Responsibility để validate dữ liệu, kiểm tra quyền, business invariants.
4. **Lựa chọn logic**: Dùng Factory để chọn Strategy thực thi theo ngữ cảnh.
5. **Tăng cường tính năng**: Dùng Decorator/Proxy để bọc logic phụ (log, cache, phí, ...).
6. **Xử lý lõi**: Thực thi hành vi trên Rich Domain Model, dùng State nếu có vòng đời.
7. **Persistence**: Lưu vào MySQL trong một `@Transactional` duy nhất.
8. **Hậu xử lý**: Sau commit, kích hoạt Observer để chạy side-effects qua Adapter.

Dưới đây là đối chiếu cụ thể cho các luồng Teacher write:

---

### 2.1 TeacherAssignmentFacade (create/update/delete)

**File chính**:

- `backend/src/main/java/com/f4/forum/service/TeacherAssignmentFacade.java`
- `backend/src/main/java/com/f4/forum/entity/Assignment.java`
- `backend/src/main/java/com/f4/forum/dto/request/CreateTeacherAssignmentCommand.java`
- `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherAssignmentCommand.java`

**Những bước đã khớp pipeline**:

- (1) **Command**:
  - Controller tạo `CreateTeacherAssignmentCommand` / `UpdateTeacherAssignmentCommand` từ HTTP params.
- (2) **Facade**:
  - `TeacherController` gọi `teacherAssignmentFacade.createAssignment(...)`, `updateAssignment(...)`, `deleteAssignment(...)`.
- (6) **Core trên Rich Domain Model**:
  - Entity `Assignment` có `updateBasics(...)` với nghiệp vụ (trim, validate, maxScore > 0, ...).
  - Một phần validate đang ở facade (command-level), một phần ở entity (domain-level).
- (7) **Persistence trong một transaction**:
  - `TeacherAssignmentFacade` dùng `@Transactional` cho các method write.

**Những bước đang thiếu / có thể cải thiện**:

- (3) **Chain of Responsibility**:
  - Hiện tại validate (tiêu đề/description không rỗng, quyền sở hữu lớp, điểm tối đa, ...) được xử lý inline bằng `if`/`throw` trong facade.
  - Chưa có một “chuỗi validators” rõ ràng kiểu `Handler` (ValidateOwnershipHandler -> ValidateInputHandler -> BusinessRulesHandler).
- (4) **Factory/Strategy**:
  - Các nhánh logic tương đối đơn giản (ví dụ chọn mặc định `maxScore`, `dueDate`), đang dùng if/ternary.
  - Chưa có Strategy theo ngữ cảnh (ví dụ: nhiều kiểu assignment khác nhau).
- (5) **Decorator** (ngoài Proxy Spring):
  - Logging, caching, audit… chủ yếu dựa vào Spring proxy và log rời rạc; không có lớp decorator riêng cho assignment.
- (8) **Observer + Adapter cho side-effects**:
  - Không thấy `ApplicationEventPublisher` / `publishEvent(...)` trong `TeacherAssignmentFacade`.
  - Không có event kiểu “AssignmentCreatedEvent” / “AssignmentUpdatedEvent” để trigger email/notification.

---

### 2.2 TeacherMaterialFacade (create/update/delete)

**File chính**:

- `backend/src/main/java/com/f4/forum/service/TeacherMaterialFacade.java`
- `backend/src/main/java/com/f4/forum/entity/Material.java`
- `backend/src/main/java/com/f4/forum/dto/request/CreateTeacherMaterialCommand.java`
- `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherMaterialCommand.java`

**Đã khớp**:

- (1) **Command**:
  - Sử dụng `CreateTeacherMaterialCommand`, `UpdateTeacherMaterialCommand`.
- (2) **Facade**:
  - Controller gọi thẳng `TeacherMaterialFacade` cho create/update/delete.
- (6) **Core Domain**:
  - Entity `Material.updateBasics(...)` chứa nghiệp vụ (trim, handle null, cập nhật fileUrl và uploadDate).
- (7) **@Transactional**:
  - Các method write (`createMaterial`, `updateMaterial`, `deleteMaterial`) có `@Transactional`.

**Thiếu / có thể cải thiện**:

- (3) **Chain of Responsibility**:
  - Validate title, file name, quyền sở hữu lớp đang inline trong facade qua if/throw.
  - Có thể tách thành chuỗi bước rõ ràng hơn: `TokenValidator` -> `RoleValidator` -> `ClassOwnershipValidator` -> `MaterialInputValidator`.
- (4) **Factory/Strategy**:
  - Chưa có sự lựa chọn strategy theo loại tài liệu (video/pdf/link, ...). Nếu sau này mở rộng, pattern này hữu ích.
- (5) **Decorator**:
  - Không có decorator cho “tăng cường tính năng” như virus scan, metadata enrichment, …; cross-cutting vẫn dựa trên Spring AOP.
- (8) **Observer**:
  - Không publish event kiểu “MaterialUploadedEvent” để gửi notification hoặc sync sang hệ thống khác.

---

### 2.3 TeacherAttendanceFacade (saveAttendance)

**File chính**:

- `backend/src/main/java/com/f4/forum/service/TeacherAttendanceFacade.java`
- `backend/src/main/java/com/f4/forum/entity/Attendance.java`
- `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherAttendanceCommand.java`

**Đã khớp**:

- (1) **Command**:
  - `UpdateTeacherAttendanceCommand` chứa list entries (mỗi entry có `enrollmentId`, `isPresent`, `remarks`).
- (2) **Facade**:
  - Controller gọi `teacherAttendanceFacade.saveAttendance(classId, scheduleId, token, command)`.
- (6) **Core Domain (Rich Model)**:
  - Entity `Attendance` có behavior `markPresent(...)` và `markAbsent(...)`; facade không tự set flag trực tiếp.
- (7) **@Transactional**:
  - `saveAttendance` được đánh `@Transactional`.

**Thiếu / có thể cải thiện**:

- (3) **Chain of Responsibility**:
  - Validate list rỗng, validate enrollmentId hợp lệ, validate schedule thuộc class, validate teacher owns class… đang trộn trong một method lớn.
  - Có thể refactor thành chain gồm các “validator handler” chuyên trách từng invariant.
- (4) **Factory/Strategy**:
  - Nhánh `present/absent` xử lý bằng if (present) → `markPresent` else → `markAbsent`.
  - Nếu sau này có nhiều “kiểu điểm danh” (ví dụ: auto-check-in, manual, imported), Strategy sẽ hữu ích, hiện tại chưa áp dụng.
- (5) **Decorator**:
  - Không có decorator cho attendance (ví dụ log audit riêng, gửi webhook…) mà không chạm vào facade.
- (8) **Observer**:
  - Không có event “AttendanceSavedEvent” được publish sau khi `saveAttendance` hoàn tất.

---

### 2.4 TeacherGradesFacade (saveGrades)

**File chính**:

- `backend/src/main/java/com/f4/forum/service/TeacherGradesFacade.java`
- `backend/src/main/java/com/f4/forum/entity/Result.java`
- `backend/src/main/java/com/f4/forum/dto/request/UpdateTeacherGradesCommand.java`

**Đã khớp**:

- (1) **Command**:
  - `UpdateTeacherGradesCommand` với list entries (enrollmentId, midtermScore, finalScore, grade, teacherComment).
- (2) **Facade**:
  - Controller gọi `teacherGradesFacade.saveGrades(classId, token, command)`.
- (6) **Core Domain**:
  - Entity `Result.updateScores(...)` cập nhật điểm/grade/comment.
  - Điểm được validate qua method `validateScore(...)`.
- (7) **@Transactional**:
  - `saveGrades` có `@Transactional`.

**Thiếu / có thể cải thiện**:

- (3) **Chain of Responsibility**:
  - Validate quyền + validate entries không rỗng + validate range điểm đang trộn trong một method.
  - Có thể tách thành nhiều handler để đảm bảo dễ mở rộng và test.
- (4) **Factory/Strategy**:
  - Hiện tại chỉ có một kiểu tính điểm (midterm/final). Nếu mai này có nhiều scheme (quiz/assignment weighting), dùng Strategy sẽ phù hợp, nhưng hiện chưa có.
- (5) **Decorator**:
  - Các việc như audit log thay đổi điểm, gửi thông báo cho student… hiện chưa tách thông qua decorator.
- (8) **Observer**:
  - Không publish `GradeUpdatedEvent` hay tương tự sau khi điểm được lưu.

---

## 3. Tóm tắt “khoảng trống” so với Pipeline mục 4 (cho Teacher write)

### Bước đã làm tốt

- **Command (1)**: Được áp dụng đều đặn cho hầu hết use case write (Teacher, Branch, Course, User).
- **Facade (2)**: Mỗi module đều có Facade rõ ràng, Controller mỏng.
- **Core Domain (6)**: Domain model giàu hành vi, các update/transition nằm trong entity.
- **Transactional (7)**: Mọi write quan trọng đều đặt trong `@Transactional`.

### Bước còn thiếu hoặc mới áp dụng cục bộ

- **Chain of Responsibility (3)**:
  - Hiện chưa có kiến trúc CoR rõ ràng. Validation/authorization được viết inline trong Facade.
  - Cơ hội áp dụng tốt ở:
    - `TeacherAssignmentFacade.*Assignment`
    - `TeacherMaterialFacade.*Material`
    - `TeacherAttendanceFacade.saveAttendance`
    - `TeacherGradesFacade.saveGrades`
- **Factory/Strategy (4)**:
  - Chỉ áp dụng rõ trong Auth (`AuthStrategy` + `AuthFacade`) và `UserFactory`.
  - Module Teacher chưa tận dụng Strategy cho các biến thể logic (vd: kiểu bài tập, kiểu tài liệu, scheme tính điểm…).
- **Decorator (5)**:
  - Cross-cutting hiện chủ yếu dựa trên Spring proxy (`@Transactional`, `@Async`).
  - Chưa có decorator riêng cho logging/audit/cache ở từng module.
- **Observer via Adapter (8)**:
  - Đã có ở `BranchService` và `AuthFacade` (Login), nhưng **chưa có** cho Teacher write (Assignment/Material/Attendance/Grades).
  - Đây là gap lớn nếu muốn tuân thủ triệt để pipeline “Sau commit bắn event để xử lý side-effect”.

---

## 4. Gợi ý hướng refactor (ngắn gọn)

> Không code trực tiếp, chỉ gợi ý để bạn cân nhắc khi muốn nâng kiến trúc lên chuẩn “WOW Pipeline”.

- **Cho Assignment/Material/Attendance/Grades**:
  - Tạo các **Validator Handler** riêng, implement một interface `ValidationHandler<Command>` với method `handle(...)` + `setNext(...)`.
  - Dùng một **Factory** hoặc Builder để lắp chain phù hợp cho từng use case (create/update/delete).
  - Giữ Facade mỏng: chỉ xây chain và gọi `handler.handle(commandContext)`.
- **Cho lựa chọn Strategy**:
  - Nếu sau này có loại assignment/material/grade scheme khác nhau: define `AssignmentStrategy`, `MaterialDeliveryStrategy`, `GradingStrategy` và dùng Factory để chọn dựa trên type từ command.
- **Cho Observer**:
  - Định nghĩa các event như `AssignmentCreatedEvent`, `MaterialUploadedEvent`, `AttendanceSavedEvent`, `GradesUpdatedEvent`.
  - Trong Facade, sau khi domain + repo xong, publish event.
  - Tạo Listener tương ứng để gửi email/notification/sync data qua các Adapter (bọc API ngoài).

Những refactor này sẽ giúp các luồng Teacher write tiến gần hơn 100% pipeline mục 4 trong `BE_SKILLS.md`, đồng thời tận dụng lại cách bạn đã làm rất tốt ở `AuthFacade` và `BranchService`.

