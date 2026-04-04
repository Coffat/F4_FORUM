# Code Review Report - F4 Forum

> **Ngày tạo**: 2026-04-04  
> **Dự án**: F4 Forum - Hệ thống Quản lý Trung tâm Tiếng Anh/IELTS  
> **Công nghệ**: Java 21 + Spring Boot 3.4 (Backend) | Next.js 16 + React 19 (Frontend)

---

## 1. Tổng quan dự án

### 1.1 Cấu trúc thư mục
```
F4_FORUM/
├── backend/src/main/java/com/f4/forum/
│   ├── controller/      # REST APIs (17 controllers)
│   ├── service/         # Business logic + Facade
│   ├── entity/          # Domain models (21 entities)
│   ├── dto/             # Data Transfer Objects
│   ├── repository/      # Spring Data JPA
│   ├── security/        # JWT, Authentication
│   ├── config/          # Spring configuration
│   ├── exception/      # Exception handling
│   ├── state/           # State pattern
│   ├── event/           # Observer pattern
│   ├── validation/      # Chain of Responsibility
│   ├── aspect/          # AOP
│   └── command/         # CQRS pattern
│
├── frontend/
│   └── src/app/
│       ├── admin/       # Admin portal
│       ├── staff/       # Staff portal
│       ├── teacher/     # Teacher portal
│       └── student/     # Student portal
```

### 1.2 Design Patterns đã áp dụng
- **Facade Pattern** - Entry point cho các module nghiệp vụ
- **Command Pattern** - CQRS cho xử lý command
- **State Pattern** - Quản lý trạng thái Invoice/Enrollment
- **Observer Pattern** - Event handling (Spring Events)
- **Strategy Pattern** - Schedule validation (Online/Offline)
- **Factory Pattern** - Object creation
- **Chain of Responsibility** - Validation chain
- **Adapter Pattern** - External services

---

## 2. Đánh giá Backend (Java/Spring Boot)

### 2.1 Điểm mạnh

#### ✅ Kiến trúc tốt
- **Layered Architecture** rõ ràng: Controller → Service → Repository
- **Rich Domain Model**: Entities chứa business logic thay vì chỉ là data containers
- **Facade Pattern** được sử dụng nhất quán cho các module phức tạp

#### ✅ Áp dụng Design Patterns hiệu quả
- State Pattern cho Invoice/Enrollment lifecycle
- Command Pattern cho CQRS
- Event-driven architecture với Spring Events

#### ✅ Security tốt
- JWT Authentication với filter
- BCrypt password encoder
- CORS configuration cho development
- Method-level security với `@PreAuthorize`

#### ✅ Transaction management
- Sử dụng `@Transactional` đúng cách
- Read-only transactions cho query operations

#### ✅ Error handling
- Centralized `GlobalExceptionHandler`
- Custom exceptions: `UnauthorizedException`, `ResourceNotFoundException`, `ValidationException`, `BusinessRuleViolationException`

### 2.2 Điểm cần cải thiện

#### ⚠️ Security Issues

**1. CORS cho phép mọi localhost ports (SecurityConfig.java:40-43)**
```java
configuration.setAllowedOriginPatterns(List.of(
    "http://localhost:*",
    "http://127.0.0.1:*"
));
```
→ **Khuyến nghị**: Restrict về specific ports hoặc sử dụng environment-specific config

**2. Nhiều endpoints được permitAll() (SecurityConfig.java:62-78)**
```java
.requestMatchers("/api/v1/staff-dashboard/**").permitAll()
.requestMatchers("/api/v1/staff/courses/**").permitAll()
// ... nhiều staff endpoints khác
```
→ **Khuyến nghị**: Đây là demo code, cần implement đúng role-based access trước production

**3. Auth controller trả về raw exception message (AuthController.java:40-42)**
```java
} catch (Exception e) {
    return ResponseEntity.badRequest().body(e.getMessage());
}
```
→ **Khuyến nghị**: Log error và trả về message generic

#### ⚠️ Performance Issues

**1. N+1 Query Problem (TeacherClassesFacade.java:61-64)**
```java
List<ClassEntity> classes = classRepository.findAll().stream()
    .filter(c -> c.getTeachers().stream().anyMatch(t -> Objects.equals(t.getId(), teacherId)))
    .filter(c -> statuses.contains(c.getStatus()))
    .collect(Collectors.toList());
```
→ **Khuyến nghị**: Sử dụng custom query với JOIN FETCH

**2. Thiếu Caching**
→ **Khuyến nghị**: Cache các endpoint thường xuyên được gọi (courses, classes list)

#### ⚠️ Code Quality

**1. Inconsistent Exception Handling (CourseCommandService.java:35-36)**
```java
.orElseThrow(() -> new RuntimeException("Course not found"));
```
→ **Khuyến nghị**: Sử dụng `ResourceNotFoundException` thay vì RuntimeException

**2. System.out.println usage (SecurityConfig.java:54)**
```java
System.out.println(">>> Security Architecture: ACTIVE with JWT Filter");
```
→ **Khuyến nghị**: Sử dụng SLF4J Logger

**3. Generic exception handler trả về internal error message (GlobalExceptionHandler.java:37)**
```java
return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
```
→ **Khuyến nghị**: Không expose internal error message ra ngoài

#### ⚠️ Missing Features

1. **Không có unit tests** cho business logic
2. **Không có API documentation** chi tiết (dù đã có Swagger annotations)
3. **Thiếu Input Validation** ở controller level (nên dùng `@Valid` @RequestBody)
4. **Thiếu Rate Limiting** cho authentication endpoints

### 2.3 Backend Score: 7/10

---

## 3. Đánh giá Frontend (Next.js/React)

### 3.1 Điểm mạnh

#### ✅ Hiện đại và clean
- Sử dụng **Next.js 16** với App Router
- **React 19** với Server Actions
- **TypeScript** cho type safety
- **Tailwind CSS v4** cho styling

#### ✅ Server Actions
- Sử dụng đúng pattern cho form submissions (`loginAction`)
- Server-side validation với Zod

#### ✅ Component Architecture
- Tách biệt UI components (`/components/ui`)
- Reusable design system
- Server Components cho data fetching

#### ✅ Authentication Flow
- HttpOnly cookies cho JWT token
- Role-based redirect sau login
- Logout action với cookie cleanup

### 3.2 Điểm cần cải thiện

#### ⚠️ Error Handling

**1. Login action không handle network errors properly (actions.ts:44-47)**
```javascript
} catch (error) {
    console.error('Lỗi khi kết nối BE:', error);
    return { error: 'Backend Server không phản hồi! (Lỗi Connection)' };
}
```
→ **Khuyến nghị**: Thêm retry logic hoặc exponential backoff

**2. Không có Error Boundary** cho toàn bộ app
→ **Khuyến nghị**: Wrap app với ErrorBoundary component

#### ⚠️ Security

**1. Role stored in non-httpOnly cookie (actions.ts:59-65)**
```javascript
cookieStore.set('auth_role', resultRole, {
    httpOnly: false, // Có thể bị XSS đọc được
    // ...
});
```
→ **Khuyến nghị**: Lưu role trong JWT payload thay vì cookie riêng biệt

#### ⚠️ Performance

**1. Thiếu loading states** cho một số page
→ **Khuyến nghị**: Thêm Suspense boundaries và loading.tsx

**2. Không có data caching strategy**
→ **Khuyến nghị**: Sử dụng React Query hoặc Next.js caching

#### ⚠️ Code Quality

**1. Hardcoded API URL (actions.ts:30)**
```javascript
const response = await fetch('http://localhost:8080/api/v1/auth/login', {
```
→ **Khuyến nghị**: Sử dụng environment variable

**2. Không có API client abstraction**
→ **Khuyến nghị**: Tạo axios instance hoặc fetch wrapper với interceptors

#### ⚠️ Missing Features

1. **Không có unit tests** cho components
2. **Không có E2E tests** cho critical flows
3. **Thiếu accessibility** considerations (aria labels, keyboard navigation)
4. **Không có i18n** setup

### 3.3 Frontend Score: 7.5/10

---

## 4. Recommendations

### 4.1 Immediate Actions (High Priority)

| # | Issue | Location | Action |
|---|-------|----------|--------|
| 1 | Expose internal errors | `GlobalExceptionHandler.java:37` | Return generic message |
| 2 | N+1 queries | `TeacherClassesFacade.java:61-64` | Add custom query with JOIN |
| 3 | Non-httpOnly role cookie | `actions.ts:60` | Store role in JWT payload |
| 4 | Hardcoded API URL | `actions.ts:30` | Use environment variable |

### 4.2 Short-term Improvements

1. **Thêm Unit Tests** - Viết tests cho các service/ facade quan trọng
2. **API Validation** - Thêm `@Valid` cho tất cả @RequestBody
3. **Caching** - Implement Redis cache cho courses, classes
4. **Error Boundaries** - Thêm vào React app
5. **TypeScript strict mode** - Bật strict mode trong tsconfig

### 4.3 Long-term Improvements

1. **Microservices architecture** - Tách biệt các module thành services riêng
2. **Event-driven** - Sử dụng Kafka/RabbitMQ cho async processing
3. **API Gateway** - Thêm gateway cho统一 authentication và rate limiting
4. **Monitoring** - Add Prometheus metrics và OpenTelemetry tracing
5. **CI/CD** - Setup automated testing và deployment pipeline

---

## 5. Summary

| Category | Score | Notes |
|----------|-------|-------|
| Backend Architecture | 8/10 | Tốt, sử dụng đúng patterns |
| Backend Security | 6/10 | Cần cải thiện authentication |
| Backend Performance | 7/10 | Cần optimize queries |
| Frontend Architecture | 8/10 | Hiện đại và clean |
| Frontend Security | 6/10 | Cookie handling cần cải thiện |
| Code Quality | 7/10 | Cần thêm tests |
| **Overall** | **7/10** | **Production-ready sau khi fix issues** |

---

## 6. Files Reviewed

### Backend
- `SecurityConfig.java`
- `AuthController.java`
- `GlobalExceptionHandler.java`
- `CourseCommandService.java`
- `TeacherClassesFacade.java`
- `User.java`
- `Course.java`

### Frontend
- `login/page.tsx`
- `actions.ts`

---

*Generated by Code Review Agent*
