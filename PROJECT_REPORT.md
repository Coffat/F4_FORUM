# 📊 Báo cáo Tình hình dự án: F4 Forum

**Ngày cập nhật:** 02/04/2026
**Trạng thái:** Phân hệ Student đã thông suốt (Fullstack).

---

## 🚀 1. Tổng quan Công nghệ
Dự án F4 Forum được xây dựng trên bộ khung **Modern Fullstack 2026**:
- **Backend:** Spring Boot 3.4, Java 21, Spring Data JPA, Spring Security (JWT).
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Shadcn UI.
- **Database:** MySQL 8.0, Docker Compose.

---

## 📂 2. Cấu trúc mã nguồn chi tiết (Mới nhất)

### 🔵 Phân hệ Backend (Module Query & Security)
Hệ thống đã triển khai tầng Query Service tách biệt hoàn toàn để đảm bảo hiệu năng:
- `repository/EnrollmentRepository.java`: Truy vấn ghi danh sử dụng **JOIN FETCH** để tránh lỗi N+1.
- `repository/StudentRepository.java`: Quản lý thực thể Student.
- `dto/response/StudentDashboardResponse.java`: DTO Record (Java 21) cho Dashboard an toàn.
- `service/query/StudentQueryService.java`: Logic nghiệp vụ trích xuất dữ liệu Dashboard cho học viên (Read-only).
- `controller/StudentController.java`: API Endpoint `/api/v1/student/dashboard` bảo mật với `@PreAuthorize`.

### 🟢 Phân hệ Frontend (Student Portal)
Kiến trúc App Router với sự tách biệt giữa Server và Client Components:
- `src/app/student/layout.tsx`: Server Layout chung cho học viên, tích hợp Header & Sidebar.
- `src/components/student/StudentSidebar.tsx`: Client Sidebar với logic active-menu thông minh.
- `src/app/student/dashboard/page.tsx`: Server Page thực hiện Fetch dữ liệu từ BE và Render UI.
- `src/components/ui/badge.tsx`: UI Component mới phục vụ hiển thị trạng thái lớp học.
- `middleware.ts`: Hệ thống Guard chặn truy cập trái phép vào `/student/*`.

---

## 🔐 3. Quản lý Tài khoản & Phân quyền

Hệ thống ghi nhận 3 vai trò chính với các tài khoản test trong `init.sql`:

| Role | Username | Password | Redirect Path | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `1` | `/admin` | ✅ Đã hoàn thiện |
| **Staff** | `staff` | - | `/staff/dashboard` | ✅ Đã có giao diện |
| **Student** | **`tai`** | **`1`** | `/student/dashboard` | ✅ Đã thông suốt |

---

## 🛠 4. Các tính năng đã triển khai cho Student
1. **Security Guard:** Bảo vệ nghiêm ngặt các route học viên thông qua Middleware.
2. **Auto Redirection:** Đăng nhập đúng Role sẽ tự động chuyển hướng về Dashboard tương ứng.
3. **Dashboard UI:**
   - Lời chào cá nhân hóa (Welcome Hero).
   - Thẻ thống kê số lớp học đang tham gia.
   - Danh sách lớp học hiển thị dưới dạng Grid Card chuyên nghiệp.
4. **Data Sync:** Dữ liệu Dashboard được đồng bộ trực tiếp từ Database thông qua JWT Authorization Header.

---

## 📝 5. Danh sách việc cần làm (To-Do)
- [ ] Xây dựng trang **Lịch học** (`/student/schedules`) để học viên xem chi tiết thời gian lên lớp.
- [ ] Triển khai trang **Kết quả học tập** (`/student/results`) để hiển thị điểm thi định kỳ.
- [ ] Xây dựng tính năng **Nộp bài tập** tích hợp quản lý trạng thái Submission.
- [ ] Tối ưu hóa UI/UX cho phiên bản Mobile (Responsive Sidebar).

---

> [!IMPORTANT]
> **Lưu ý kỹ thuật:** Mọi API dành cho Student tuyệt đối không được nhận `studentId` từ Client. ID phải được trích xuất từ Token phía Backend để bảo mật (Anti-IDOR).
