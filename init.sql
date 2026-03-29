-- Thiết lập bảng mã UTF-8 để hiển thị đúng tiếng Việt
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Tắt kiểm tra khóa ngoại để thuận tiện cho việc DROP
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. DROP TABLES THEO THỨ TỰ REVERSE DEPENDENCY
-- ==========================================
DROP TABLE IF EXISTS invoice_promotions;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoice_details;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS promotions;

DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS placement_tests;

DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS materials;

DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS class_teachers;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS branches;

DROP TABLE IF EXISTS staff_members;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS user_accounts;
DROP TABLE IF EXISTS users;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- --- AUTH & USERS ---
CREATE TABLE users (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    user_type ENUM('STUDENT', 'TEACHER', 'STAFF') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_accounts (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    last_login DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE students (
    user_id BIGINT PRIMARY KEY,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    registration_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE teachers (
    user_id BIGINT PRIMARY KEY,
    specialty VARCHAR(255),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE staff_members (
    user_id BIGINT PRIMARY KEY,
    department VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --- INFRA & CATALOG ---
CREATE TABLE branches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    manager_id BIGINT,
    capacity INT DEFAULT 500,
    current_enrollment INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    version BIGINT DEFAULT 0,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT,
    room_type VARCHAR(100),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

CREATE TABLE courses (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    max_enrollment INT DEFAULT 0,
    current_enrollment INT DEFAULT 0,
    image_url TEXT,
    image_color VARCHAR(50)
);

-- --- OPERATIONS ---
CREATE TABLE classes (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    default_room_id BIGINT,
    class_code VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE,
    end_date DATE,
    max_students INT,
    status VARCHAR(50) DEFAULT 'OPEN',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (default_room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

CREATE TABLE class_teachers (
    class_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    PRIMARY KEY (class_id, teacher_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE CASCADE
);

CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    room_id BIGINT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- --- ENROLLMENT & ACADEMIC ---
CREATE TABLE enrollments (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    enrollment_date DATE,
    status VARCHAR(50) DEFAULT 'ENROLLED',
    UNIQUE KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    is_present BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    UNIQUE KEY (schedule_id, enrollment_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
);

CREATE TABLE placement_tests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    test_date DATE,
    score DECIMAL(5, 2),
    recommended_level VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE results (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id BIGINT UNIQUE NOT NULL,
    midterm_score DECIMAL(5, 2),
    final_score DECIMAL(5, 2),
    grade VARCHAR(10),
    teacher_comment TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
);

CREATE TABLE certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    certificate_url TEXT,
    issue_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- --- LMS: LEARNING MANAGEMENT ---
CREATE TABLE materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    class_id BIGINT,
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(50),
    file_url TEXT NOT NULL,
    upload_date DATE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_url TEXT,
    due_date DATETIME,
    max_score DECIMAL(5, 2),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE CASCADE
);

CREATE TABLE submissions (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    teacher_id BIGINT,
    submission_date DATETIME,
    file_url TEXT,
    score DECIMAL(5, 2),
    teacher_comment TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE SET NULL
);

-- --- FINANCE ---
CREATE TABLE promotions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2),
    max_discount_amount DECIMAL(15, 2),
    end_date DATE
);

CREATE TABLE invoices (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    base_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'UNPAID',
    due_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE invoice_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    description VARCHAR(255),
    unit_price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(15, 2) DEFAULT 0.00,
    final_price DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE RESTRICT
);

CREATE TABLE invoice_promotions (
    invoice_id BIGINT NOT NULL,
    promotion_id BIGINT NOT NULL,
    PRIMARY KEY (invoice_id, promotion_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    version BIGINT DEFAULT 0,
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    method VARCHAR(50),
    reference_code VARCHAR(100),
    status VARCHAR(50) DEFAULT 'SUCCESS',
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. INDEXES (OPTIMIZATION)
-- ==========================================
-- Thêm Indexes tối ưu truy vấn cho các trường hay dùng trong mệnh đề WHERE hoặc JOIN
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_student_enrollment ON enrollments(student_id, class_id);
CREATE INDEX idx_schedule_date ON schedules(date);
CREATE INDEX idx_invoice_student ON invoices(student_id);

-- ==========================================
-- 4. SEED DATA
-- ==========================================

-- ── Admin Account ──────────────────────────────────────────────────────
INSERT INTO users (id, full_name, phone, email, status, user_type)
VALUES (1, 'Quản trị viên Hệ thống', '0123456789', 'admin@f4forum.com', 'ACTIVE', 'STAFF');

INSERT INTO staff_members (user_id, department)
VALUES (1, 'IT Administration');

-- Mật khẩu "1" đã được mã hóa BCrypt chính xác
INSERT INTO user_accounts (user_id, username, password_hash, role)
VALUES (1, 'admin', '$2a$10$xcYRr1tTzyhc12N/wy9S3us65L2Yy0.3YuzDWsqbFcJsqGHJsQ5hC', 'ROLE_ADMIN');


-- ── Giáo Viên ─────────────────────────────────────────────────────────
INSERT INTO users (id, full_name, phone, email, status, user_type) VALUES
(2, 'Nguyễn Lan Anh', '0901111222', 'lan.anh@f4forum.com', 'ACTIVE', 'TEACHER'),
(3, 'Trần Minh Quân', '0902222333', 'minh.quan@f4forum.com', 'ACTIVE', 'TEACHER'),
(4, 'Phạm Thu Hà',   '0903333444', 'thu.ha@f4forum.com', 'ACTIVE', 'TEACHER'),
(5, 'Lê Văn Đức',    '0904444555', 'van.duc@f4forum.com', 'ACTIVE', 'TEACHER');

INSERT INTO teachers (user_id, specialty, hire_date) VALUES
(2, 'IELTS Academic, Cambridge CELTA – Band 8.5', '2020-03-01'),
(3, 'IELTS General, Business English – Band 8.0', '2019-09-15'),
(4, 'Academic Writing, IELTS Writing – Band 8.5', '2021-06-01'),
(5, 'IELTS Expert, Speaking Coach – Band 9.0',     '2018-01-10');

-- ── Chi Nhánh ─────────────────────────────────────────────────────────
INSERT INTO branches (id, name, address, phone, manager_id, capacity, current_enrollment, status) VALUES
(1, 'Saigon Central',  'District 1, HCM City', '028-3911-2222', 2, 450, 385, 'ACTIVE'),
(2, 'Hanoi West',       'Cau Giay, Hanoi', '024-3927-4455', 4, 300, 120, 'MAINTENANCE'),
(3, 'Da Nang Coast',    'Ngu Hanh Son, Da Nang', '0511-3822-333', 1, 250, 210, 'ACTIVE');

-- ── Phòng Học ─────────────────────────────────────────────────────────
INSERT INTO rooms (id, branch_id, name, capacity, room_type) VALUES
(1, 1, 'Phòng 101 – Lớp Nhỏ',     15, 'CLASSROOM'),
(2, 1, 'Phòng 201 – Lớp Trung',   25, 'CLASSROOM'),
(3, 1, 'Phòng 301 – Hội Thảo',    40, 'SEMINAR'),
(4, 1, 'Phòng 401 – Speaking Lab', 12, 'LAB'),
(5, 2, 'Phòng A01 – Lớp Nhỏ',     15, 'CLASSROOM'),
(6, 2, 'Phòng A02 – Lớp Trung',   25, 'CLASSROOM');

-- ── Khóa Học IELTS (8 level – từ căn bản đến Band 8.0+) ──────────────
INSERT INTO courses (id, code, name, description, level, fee) VALUES
(1,  'IELTS-FON', 'IELTS Foundation – Khởi Đầu',
    'Khởi đầu hành trình IELTS từ con số 0. Xây nền tảng vững chắc về ngữ pháp, từ vựng cơ bản, phát âm và 4 kỹ năng theo chuẩn Cambridge. Phù hợp học viên chưa biết gì về IELTS. Mục tiêu đầu ra: 3.0 – 4.0.',
    'STARTER', 3800000.00),

(2,  'IELTS-ELM', 'IELTS Elementary – Nền Tảng',
    'Củng cố nền tảng ngữ pháp và phát triển đồng đều 4 kỹ năng. Làm quen với cấu trúc đề thi IELTS và các dạng bài phổ biến. Bước đệm quan trọng trước khi chinh phục Band 5.0.',
    'ELEMENTARY', 4200000.00),

(3,  'IELTS-PRE', 'IELTS Pre-Intermediate – Bước Đệm',
    'Nâng cao kỹ năng nghe nói đọc viết, làm quen cấu trúc đề thi chính thức. Thực hành chiến lược thi thật với đề IELTS Cambridge. Mục tiêu Band 5.0 – 5.5.',
    'PRE-INTERMEDIATE', 4800000.00),

(4,  'IELTS-INT', 'IELTS Intermediate – Đột Phá',
    'Đột phá Band 6.0 với chiến lược ôn thi chuyên sâu, mock test thực chiến hàng tuần và phản hồi cá nhân hóa từ giảng viên. Học viên được luyện tập với đề thi thật từ Cambridge.',
    'INTERMEDIATE', 5500000.00),

(5,  'IELTS-UPP', 'IELTS Upper-Intermediate – Vươn Xa',
    'Tinh chỉnh từng kỹ năng, xử lý chuyên sâu Writing Task 2 và Speaking Part 3. Chiến lược nâng band từ 6.0 lên 6.5. Phân tích từng lỗi sai và kỹ thuật ghi điểm tối đa.',
    'UPPER-INTERMEDIATE', 6200000.00),

(6,  'IELTS-ADV', 'IELTS Advanced – Chinh Phục',
    'Chinh phục Band 7.0 từ nền tảng 6.5. Kỹ thuật nâng cao cho Writing Academic và Speaking Part 3. Phân tích bài thi IELTS Cambridge chuyên sâu. Luyện thi cùng cựu giám khảo IELTS.',
    'ADVANCED', 7200000.00),

(7,  'IELTS-PRO', 'IELTS Professional – Xuất Sắc',
    'Lớp tinh anh dành cho học viên mục tiêu 7.5. Luyện tập 1-1 cùng cựu giám khảo IELTS Cambridge. Phân tích từng câu trả lời, ghi chép điểm yếu và cải thiện theo lộ trình cá nhân hóa.',
    'HIGH-ADVANCED', 8500000.00),

(8,  'IELTS-EXP', 'IELTS Expert – Đỉnh Cao 8.0+',
    'Chinh phục Band 8.0 trở lên với lộ trình 1-1 hoàn toàn cùng chuyên gia Band 9.0. Phân tích sâu từng câu trả lời, luyện tập cường độ cao. Cam kết đầu ra Band 8.0+ hoặc học lại miễn phí.',
    'EXPERT', 9800000.00),

-- ── Khóa Học Khác ─────────────────────────────────────────────────────
(9,  'ACAD-WRT', 'Academic Writing Mastery',
    'Thành thạo kỹ năng viết học thuật chuẩn quốc tế: luận văn, báo cáo khoa học và bài luận phong cách Cambridge. Phù hợp nghiên cứu sinh và sinh viên đại học quốc tế.',
    'ADVANCED', 4999000.00),

(10, 'BIZ-ENG', 'Business English Elite',
    'Tiếng Anh thương mại thực chiến: đàm phán, thuyết trình, viết email chuyên nghiệp và văn hóa doanh nghiệp quốc tế. Lớp học mô phỏng môi trường công ty đa quốc gia thực tế.',
    'INTERMEDIATE', 5499000.00);

-- ── Lớp Học (Classes) ─────────────────────────────────────────────────
INSERT INTO classes (id, course_id, default_room_id, class_code, start_date, end_date, max_students, status) VALUES
(1, 1, 1, 'FON-2026-01', '2026-04-07', '2026-06-30', 15, 'OPEN'),
(2, 2, 1, 'ELM-2026-01', '2026-04-07', '2026-06-30', 15, 'OPEN'),
(3, 3, 2, 'PRE-2026-01', '2026-04-07', '2026-07-14', 20, 'OPEN'),
(4, 4, 2, 'INT-2026-01', '2026-04-14', '2026-07-21', 20, 'OPEN'),
(5, 5, 2, 'UPP-2026-01', '2026-04-14', '2026-07-28', 18, 'OPEN'),
(6, 6, 3, 'ADV-2026-01', '2026-04-21', '2026-08-04', 25, 'OPEN'),
(7, 7, 4, 'PRO-2026-01', '2026-04-21', '2026-08-04', 12, 'OPEN'),
(8, 8, 4, 'EXP-2026-01', '2026-05-01', '2026-08-31',  8, 'OPEN');

-- ── Phân Công Giáo Viên ────────────────────────────────────────────────
INSERT INTO class_teachers (class_id, teacher_id) VALUES
(1, 2), -- FON → Ms. Lan Anh
(2, 3), -- ELM → Mr. Minh Quan
(3, 4), -- PRE → Ms. Thu Ha
(4, 3), -- INT → Mr. Minh Quan
(5, 4), -- UPP → Ms. Thu Ha
(6, 2), -- ADV → Ms. Lan Anh
(7, 5), -- PRO → Mr. Van Duc
-- ── Tài khoản Staff & Teacher Test (Mật khẩu: "1") ─────────────────────
INSERT INTO users (id, full_name, phone, email, status, user_type) VALUES
(6, 'Nhân viên Vận hành', '0999888777', 'staff@f4forum.com', 'ACTIVE', 'STAFF'),
(7, 'Giảng viên Demo', '0888777666', 'teacher@f4forum.com', 'ACTIVE', 'TEACHER');

INSERT INTO staff_members (user_id, department) VALUES (6, 'Operations');
INSERT INTO teachers (user_id, specialty, hire_date) VALUES (7, 'IELTS Specialist', '2024-01-01');

INSERT INTO user_accounts (user_id, username, password_hash, role) VALUES
(6, 'staff', '$2a$10$xcYRr1tTzyhc12N/wy9S3us65L2Yy0.3YuzDWsqbFcJsqGHJsQ5hC', 'ROLE_STAFF'),
(7, 'teacher', '$2a$10$xcYRr1tTzyhc12N/wy9S3us65L2Yy0.3YuzDWsqbFcJsqGHJsQ5hC', 'ROLE_TEACHER');

