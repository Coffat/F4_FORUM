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
    phone VARCHAR(20)
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
    fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00
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
-- 4. SEED DATA TÀI KHOẢN ADMIN XÁC THỰC
-- ==========================================
INSERT INTO users (id, full_name, phone, email, status, user_type)
VALUES (1, 'Quản trị viên Hệ thống', '0123456789', 'admin@f4forum.com', 'ACTIVE', 'STAFF');

INSERT INTO staff_members (user_id, department)
VALUES (1, 'IT Administration');

-- Mật khẩu "1" đã được mã hóa BCrypt chính xác
INSERT INTO user_accounts (user_id, username, password_hash, role)
VALUES (1, 'admin', '$2a$10$xcYRr1tTzyhc12N/wy9S3us65L2Yy0.3YuzDWsqbFcJsqGHJsQ5hC', 'ROLE_ADMIN');
