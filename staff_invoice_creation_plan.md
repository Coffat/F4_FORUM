# 🎯 Kế Hoạch Tạo Hóa Đơn (Staff Invoice Creation)

## 1. Phân Tích Yêu Cầu

### Nghiệp vụ (Business Logic)
- Staff tạo hóa đơn cho student
- Hóa đơn gồm nhiều invoice details (các khoản thu)
- Tính tổng tiền: base amount - discounts = final amount
- Áp dụng khuyến mãi (promotions)
- Set ngày đến hạn (due date)

### Design Patterns sử dụng (BE_SKILLS.md)
1. **Command Pattern** - Đóng gói request tạo hóa đơn
2. **Facade Pattern** - Điểm truy cập duy nhất (InvoiceFacade)
3. **Builder Pattern** - Tạo Invoice object
4. **Decorator Pattern** - Tính phí (thêm VAT, giảm giá)
5. **Observer Pattern** - Gửi notification sau khi tạo hóa đơn
6. **Rich Domain Model** - Business logic trong Entity

---

## 2. Backend (Spring Boot)

### 2.1 Tạo DTOs
- `CreateInvoiceCommand.java` - Command tạo hóa đơn
- `InvoiceResponse.java` - Response trả về
- `InvoiceDetailDTO.java` - Chi tiết hóa đơn

### 2.2 Tạo Repository
- `InvoiceRepository.java` - extends JpaRepository

### 2.3 Tạo Facade (Facade Pattern)
- `StaffInvoiceFacade.java` - Entry point duy nhất
  - validate dữ liệu
  - tạo Invoice với Builder
  - thêm details
  - áp dụng promotions
  - save to DB

### 2.4 Tạo Controller
- `StaffInvoiceController.java` - REST endpoints
  - POST /api/v1/staff/invoices - Tạo hóa đơn
  - GET /api/v1/staff/invoices - List hóa đơn

### 2.5 Command Handler (Command Pattern)
- `CreateInvoiceCommand.java` - implement Command interface
  - execute() - tạo hóa đơn
  - undo() - xóa hóa đơn nếu lỗi

---

## 3. Frontend (Next.js 15 + React 19)

### 3.1 UI Components (Shadcn/ui)
- `InvoiceForm.tsx` - Form tạo hóa đơn
- `InvoiceDetailList.tsx` - Danh sách chi tiết
- `StudentSearch.tsx` - Tìm kiếm student
- `EnrollmentSelect.tsx` - Chọn enrollment để tính phí

### 3.2 Pages
- `/staff/invoices/page.tsx` - Trang danh sách hóa đơn
- `/staff/invoices/create/page.tsx` - Trang tạo hóa đơn

### 3.3 API Calls (TanStack Query)
- `useCreateInvoice()` - Mutation tạo hóa đơn
- `useInvoices()` - Query danh sách hóa đơn
- `useStudents()` - Query tìm kiếm student
- `useEnrollments()` - Query enrollment của student

### 3.4 State Management (Zustand)
- `useInvoiceStore.ts` - Store cho form data

---

## 4. Thứ Tự Thực Hiện (Step by Step)

### Step 1: Backend - Entity & DTOs
1. Kiểm tra Invoice, InvoiceDetail entities (đã có)
2. Tạo CreateInvoiceCommand.java
3. Tạo InvoiceResponse.java
4. Tạo InvoiceDetailDTO.java

### Step 2: Backend - Repository & Service
1. Tạo InvoiceRepository.java
2. Tạo StaffInvoiceFacade.java
3. Tạo StaffInvoiceController.java

### Step 3: Frontend - API Layer
1. Tạo API functions (TanStack Query hooks)
2. Tạo Zustand store

### Step 4: Frontend - UI Components
1. Tạo StudentSearch component
2. Tạo EnrollmentSelect component
3. Tạo InvoiceDetailList component
4. Tạo InvoiceForm component

### Step 5: Frontend - Pages
1. Tạo /staff/invoices/create/page.tsx
2. Tạo /staff/invoices/page.tsx

### Step 6: Integration
1. Kết nối API
2. Test flow hoàn chỉnh

---

## 5. Kết Quả Mong Đợi

- ✅ Staff có thể tạo hóa đơn mới
- ✅ Chọn student và các enrollment để tính phí
- ✅ Tự động tính tổng tiền (base - discount = final)
- ✅ Áp dụng promotions
- ✅ Set due date
- ✅ Lưu vào DB thành công
- ✅ Hiển thị notification (Observer pattern)