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
