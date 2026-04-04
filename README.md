<a id="readme-top"></a>

# F4 Forum

Nền tảng Giáo dục & Cộng đồng - Kết hợp LMS và Community Forum dành cho trung tâm tiếng Anh/IELTS.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=spring-boot)](https://spring.io)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://mysql.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-FF6B6B)](LICENSE)

---

## ✨ Tính năng

### 👨‍🎓 Học viên
- 📚 Đăng ký khóa học IELTS/English
- 💬 Diễn đàn tương tác
- 📊 Theo dõi tiến độ học tập
- 📅 Xem lịch học cá nhân

### 👨‍🏫 Giáo viên
- 🏫 Quản lý lớp học
- 📝 Điểm danh & nhập điểm
- 📤 Tải tài liệu học tập
- 📅 Xem lịch giảng dạy

### 💼 Nhân viên & Admin
- 📈 Dashboard tổng quan
- 👥 Quản lý người dùng
- 💰 Quản lý hóa đơn
- 🏢 Quản lý khóa học & phòng

---

## 🛠 Công nghệ

| Backend | Frontend | Database | DevOps |
|---------|----------|----------|--------|
| Java 21 | Next.js 16 | MySQL 8.0 | Docker |
| Spring Boot 3.4 | React 19 | Redis | Maven |
| Spring Data JPA | TypeScript | - | pnpm |
| Spring Security | Tailwind v4 | - | - |

---

## 🚀 Cài đặt

### Yêu cầu
- Docker & Docker Compose
- Node.js v20+ & pnpm v9+
- Java 21 & Maven

### Các bước

```bash
# 1. Clone
git clone https://github.com/f4-forum/f4-forum.git
cd f4-forum

# 2. Database
docker-compose up -d

# 3. Backend
cd backend && mvn spring-boot:run
# → http://localhost:8080/swagger-ui.html

# 4. Frontend
cd frontend && pnpm install && pnpm dev
# → http://localhost:3000
```

---

## 📂 Cấu trúc dự án

```
F4_FORUM/
├── backend/
│   └── src/main/java/com/f4/forum/
│       ├── controller/      # REST APIs
│       ├── entity/          # Domain models
│       ├── facade/         # Business logic
│       ├── state/           # State pattern
│       ├── event/           # Observer pattern
│       ├── validation/      # Security chain
│       ├── config/          # Spring config
│       └── aspect/          # AOP
│
├── frontend/
│   └── src/app/
│       ├── admin/          # Admin portal
│       ├── staff/          # Staff portal
│       ├── teacher/        # Teacher portal
│       └── courses/        # Public courses
│
├── docker-compose.yml
├── init.sql
└── README.md
```

---

## 🏗 Kiến trúc

```
┌──────────────────────────────────────┐
│        PRESENTATION LAYER            │
│   Next.js (Frontend) + REST API      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│        APPLICATION LAYER             │
│   Facade Pattern + Command Pattern   │
└──────────────────────────────────────┘
                ▼
┌──────────────────────────────────────┐
│           DOMAIN LAYER                │
│   Rich Entities + State Pattern      │
└──────────────────────────────────────┘
                ▼
┌──────────────────────────────────────┐
│       INFRASTRUCTURE LAYER           │
│   Spring Data JPA + Redis Cache       │
└──────────────────────────────────────┘
```

### Design Patterns đã áp dụng
- **Strategy** - Xử lý giảm giá
- **Factory** - Khởi tạo objects
- **Facade** - Entry point modules
- **State** - Quản lý vòng đời
- **Observer** - Event handling
- **Adapter** - External services
- **Command** - CQRS
- **Chain of Responsibility** - Validation

---

## 📚 API Documentation

Xem chi tiết tại [API_DOCS.md](./API_DOCS.md)

---

## 🤝 Đóng góp

1. Fork dự án
2. Tạo branch: `git checkout -b feature/...`
3. Commit: `git commit -m '...'`
4. Push: `git push origin feature/...`
5. Tạo Pull Request

---

## 📄 License

MIT License - Xem [LICENSE](LICENSE)

---

<p align="center">
  <a href="#readme-top">↑ Back to top</a>
</p>
<p align="center">Made with ❤️ by F4 Forum Team</p>