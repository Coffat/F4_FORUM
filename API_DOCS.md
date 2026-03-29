# 📚 F4 Forum API Documentation

Tài liệu tham khảo các Endpoints cho giao tiếp giữa Frontend và Backend (Next.js gọi Spring Boot).

---

## 📚 2. Course Module (IELTS/English Programs)

Module quản lý danh sách các khóa học đào tạo của trung tâm.

### Lấy danh sách khóa học (GetAll)
Lấy toàn bộ các khóa học đang hoạt động hoặc lọc theo tiêu chí.

- **URL**: `/api/v1/courses`
- **Method**: `GET`
- **Auth required**: No

#### Query Parameters
| Tham số | Kiểu dữ liệu | Mô tả |
| :--- | :---: | :--- |
| `level` | String | Lọc theo trình độ (VD: `STARTER`, `ADVANCED`, `EXPERT`) |
| `keyword` | String | Tìm kiếm theo tên hoặc mã khóa học |

#### Response - Thành công (HTTP 200 OK)
Mảng JSON chứa các đối tượng `CourseDTO`.

*Ví dụ:*
```json
[
  {
    "id": 1,
    "code": "IELTS-FON",
    "name": "IELTS Foundation",
    "description": "...",
    "level": "STARTER",
    "fee": 3800000.00
  }
]
```

### Lấy chi tiết khóa học (GetById)
Xem chi tiết một khóa học thông qua ID.

- **URL**: `/api/v1/courses/{id}`
- **Method**: `GET`
- **Auth required**: No

#### Path Variables
| Tên | Kiểu dữ liệu | Mô tả |
| :--- | :---: | :--- |
| `id` | Long | ID duy nhất của khóa học |

---
*Cập nhật: 28/03/2026 bởi Senior Backend Architect*

## 🔐 1. Authentication Module

### Đăng nhập (Login)
Xác thực tài khoản người dùng và trả về Token truy cập.

- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Auth required**: No

#### Request Body (JSON)
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :---: | :---: | :--- |
| `username` | String | Có | Tên đăng nhập gốc hoặc Email của người dùng |
| `password` | String | Có | Mật khẩu xác thực |

*Ví dụ:*
```json
{
  "username": "admin",
  "password": "1"
}
```

#### Response - Thành công (HTTP 200 OK)
Trả về một JSON object chứa token bảo mật mô phỏng và các thông tin cơ bản cho Redux/Zustand Client lưu trạng thái người dùng.

*Ví dụ:*
```json
{
  "token": "eyJhbGciOiJIUz...mock_token_for_admin",
  "username": "admin",
  "role": "ROLE_ADMIN",
  "fullName": "Quản trị viên Hệ thống"
}
```

#### Response - Thất bại (HTTP 400 Bad Request)
Trả về **dạng chuỗi Text thuần (String)** mô tả lỗi để Frontend thông báo cho User.

*Ví dụ lỗi mật khẩu:*
```text
Sai mật khẩu!
```
*Ví dụ lỗi không có User:*
```text
Tài khoản không tồn tại!
```

---

## 🛠️ 3. Admin - User Management Module

Module dành riêng cho Quản trị viên điều hành nhân sự, học viên và hệ thống.

### Lấy danh sách User (Paginated)
Tìm kiếm và phân trang toàn bộ người dùng trong hệ thống.

- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Auth required**: Yes (ROLE_ADMIN)

#### Query Parameters
| Tham số | Kiểu dữ liệu | Mô tả |
| :--- | :---: | :--- |
| `search` | String | Tìm kiếm theo Tên hoặc Email (khớp một phần, không phân biệt hoa thường). Chuỗi rỗng hoặc chỉ khoảng trắng được coi như không lọc. Trên UI admin, client debounce (~350ms) và cập nhật URL khi người dùng gõ. |
| `userType` | String | Lọc đúng loại user: `STUDENT` \| `TEACHER` \| `STAFF`. Bỏ qua nếu không gửi. |
| `status` | String | Lọc đúng trạng thái: `ACTIVE` \| `INACTIVE` \| `SUSPENDED`. Bỏ qua nếu không gửi. |
| `role` | String | Lọc đúng role tài khoản: `ROLE_STUDENT` \| `ROLE_TEACHER` \| `ROLE_STAFF` \| `ROLE_ADMIN`. Bỏ qua nếu không gửi. |
| `page` | Integer | Số trang (0-indexed) |
| `size` | Integer | Số lượng bản ghi mỗi trang |

### Xem chỉ số Metrics
Lấy các số liệu tổng hợp về trạng thái người dùng.

- **URL**: `/api/admin/users/metrics`
- **Method**: `GET`
- **Auth required**: Yes (ROLE_ADMIN)

### Tạo mới người dùng (Create)
Tạo User (Sử dụng Factory Pattern cho Student/Teacher/Staff) và tài khoản đăng nhập.

- **URL**: `/api/admin/users`
- **Method**: `POST`
- **Auth required**: Yes (ROLE_ADMIN)

#### Request Body (CreateUserCommand)
```json
{
  "fullName": "Nguyễn Văn A",
  "username": "nva",
  "rawPassword": "1",
  "email": "nva@f4forum.com",
  "phone": "0901234567",
  "userType": "STUDENT",
  "role": "ROLE_STUDENT",
  "dateOfBirth": "2005-05-15",
  "gender": "Nam",
  "address": "123 Quận 1, Tp.HCM"
}
```

### Cập nhật người dùng (Update)
Chỉ cập nhật các thông tin cơ bản: Tên, Email, SĐT và Trạng thái.

- **URL**: `/api/admin/users/{id}`
- **Method**: `PUT`
- **Auth required**: Yes (ROLE_ADMIN)

#### Request Body (UpdateUserCommand)
```json
{
  "fullName": "Nguyễn Văn A (Updated)",
  "email": "nva.new@f4forum.com",
  "phone": "0909999888",
  "status": "ACTIVE"
}
```

### Xóa người dùng (Delete)
Xóa vĩnh viễn User và Account liên quan.

- **URL**: `/api/admin/users/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (ROLE_ADMIN)

---

## 👥 Personnel (Staff / Teachers directory)

### Danh sách nhân sự & giáo viên
Trả về danh sách hợp nhất (Teacher + Staff), có thể tìm kiếm và lọc theo tab.

- **URL**: `/api/v1/personnel`
- **Method**: `GET`
- **Auth required**: Yes (Bearer; theo cấu hình hiện tại)

#### Query Parameters
| Tham số | Kiểu dữ liệu | Mô tả |
| :--- | :---: | :--- |
| `search` | String | Không phân biệt hoa thường, khớp một phần trên tên, email, SĐT, hoặc specialty/department. Bỏ qua nếu rỗng. |
| `segment` | String | `ALL` (mặc định) \| `ACADEMIC` (chỉ giáo viên) \| `ADMINISTRATIVE` (chỉ nhân sự hành chính). |

### Thống kê personnel (dashboard)
- **URL**: `/api/v1/personnel/stats`
- **Method**: `GET`
