package com.f4.forum.service;

import com.f4.forum.dto.response.StaffDashboardMetricsResponse;
import com.f4.forum.dto.response.StaffDashboardMetricsResponse.RecentStaffEntry;
import com.f4.forum.entity.StaffMember;
import com.f4.forum.entity.Teacher;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.entity.enums.UserStatus;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.StaffMemberRepository;
import com.f4.forum.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * ===== FACADE PATTERN =====
 * Lớp này là Điểm Truy Cập Duy Nhất (Single Entry Point / Facade) cho toàn bộ module Staff Dashboard.
 * Nó che giấu sự phức tạp của việc phối hợp nhiều Repository khác nhau
 * (TeacherRepository, StaffMemberRepository, ClassRepository) đằng sau một interface gọn gàng.
 *
 * Controller chỉ cần gọi Facade này, không cần biết bên dưới đang làm gì.
 *
 * ===== PROXY PATTERN (Spring AOP) =====
 * @Transactional(readOnly = true) được Spring Proxy bọc ngoài tất cả các method,
 * đảm bảo mọi query trong một request là nhất quán và tự động tối ưu hóa bởi JPA.
 */
@Service
@Transactional(readOnly = true)
public class StaffDashboardFacade {

    private final TeacherRepository teacherRepository;
    private final StaffMemberRepository staffMemberRepository;
    private final ClassRepository classRepository;

    public StaffDashboardFacade(
            TeacherRepository teacherRepository,
            StaffMemberRepository staffMemberRepository,
            ClassRepository classRepository) {
        this.teacherRepository = teacherRepository;
        this.staffMemberRepository = staffMemberRepository;
        this.classRepository = classRepository;
    }

    /**
     * Tổng hợp tất cả metrics cần thiết cho trang Staff Dashboard.
     *
     * Luồng xử lý (theo Universal Pipeline trong BE_SKILLS):
     * 1. Query data song song từ các Repository
     * 2. Tính toán các chỉ số nghiệp vụ
     * 3. Xây dựng Response DTO bằng Builder Pattern
     * 4. Trả về một Object duy nhất, gọn gàng cho Controller
     *
     * @return StaffDashboardMetricsResponse chứa toàn bộ dữ liệu dashboard
     */
    public StaffDashboardMetricsResponse computeDashboardMetrics() {
        // === Bước 1: Thu thập dữ liệu (Data Collection Phase) ===
        List<Teacher> teachers = teacherRepository.findAllTeachersWithAccount();
        List<StaffMember> staffMembers = staffMemberRepository.findAllStaffWithAccount();

        List<ClassStatus> activeStatuses = List.of(ClassStatus.OPEN, ClassStatus.IN_PROGRESS);

        long activeSessions = classRepository.countByStatusIn(activeStatuses);
        long activeTeachersOnDuty = classRepository.countDistinctTeachersInActiveClasses(activeStatuses);

        // === Bước 2: Tính toán nghiệp vụ (Business Logic Phase) ===

        // Tổng giáo viên và nhân sự hành chính
        long totalTeachers = teachers.size();
        long totalAdminStaff = staffMembers.size();
        long totalFaculty = totalTeachers + totalAdminStaff;

        // Tỷ lệ giáo viên đang dạy / tổng giáo viên
        String onDutyRatio = totalTeachers > 0
                ? (activeTeachersOnDuty * 100 / totalTeachers) + "%"
                : "0%";

        // Đếm nhân sự ACTIVE (không kể INACTIVE / SUSPENDED)
        long activeTeachersCount = teachers.stream()
                .filter(t -> UserStatus.ACTIVE.equals(t.getStatus()))
                .count();
        long activeStaffCount = staffMembers.stream()
                .filter(s -> UserStatus.ACTIVE.equals(s.getStatus()))
                .count();
        long totalActiveCount = activeTeachersCount + activeStaffCount;

        // === Bước 3: Tạo danh sách nhân sự gần đây cho Widget "Recently Active" ===
        // Lấy 3 giáo viên đầu tiên + 2 staff đầu tiên (đã sort by name trong repo)
        List<RecentStaffEntry> recentlyActive = buildRecentStaffEntries(teachers, staffMembers);

        // === Bước 4: Xây dựng Response (Builder Pattern - Immutability) ===
        return StaffDashboardMetricsResponse.builder()
                .totalFaculty(totalFaculty)
                .activeSessions(activeSessions)
                .onDutyRatio(onDutyRatio)
                .activeStaffCount(totalActiveCount)
                .totalTeachers(totalTeachers)
                .totalAdminStaff(totalAdminStaff)
                .recentlyActive(recentlyActive)
                .build();
    }

    /**
     * Helper Method: Tạo danh sách "Recently Active Staff" cho widget sidebar.
     * Lấy tối đa 3 teachers + 2 staff đầu tiên (đã sorted by name từ repository).
     * Áp dụng Tell Don't Ask: yêu cầu mỗi entity cung cấp thông tin của nó thay vì tự lấy ra.
     */
    private List<RecentStaffEntry> buildRecentStaffEntries(
            List<Teacher> teachers,
            List<StaffMember> staffMembers) {

        List<RecentStaffEntry> entries = new ArrayList<>();

        // Ưu tiên ACTIVE staff trong widget
        teachers.stream()
                .filter(t -> UserStatus.ACTIVE.equals(t.getStatus()))
                .limit(3)
                .map(t -> RecentStaffEntry.builder()
                        .id(t.getId())
                        .name(t.getFullName())
                        .departmentOrSpecialty(t.getSpecialty() != null ? t.getSpecialty() : "General Teaching")
                        .roleLabel("TEACHER")
                        .avatar("https://i.pravatar.cc/100?u=teacher_" + t.getId())
                        .isActive(UserStatus.ACTIVE.equals(t.getStatus()))
                        .build())
                .forEach(entries::add);

        staffMembers.stream()
                .filter(s -> UserStatus.ACTIVE.equals(s.getStatus()))
                .limit(2)
                .map(s -> RecentStaffEntry.builder()
                        .id(s.getId())
                        .name(s.getFullName())
                        .departmentOrSpecialty(s.getDepartment() != null ? s.getDepartment() : "Administration")
                        .roleLabel("SUPPORT")
                        .avatar("https://i.pravatar.cc/100?u=staff_" + s.getId())
                        .isActive(UserStatus.ACTIVE.equals(s.getStatus()))
                        .build())
                .forEach(entries::add);

        return entries;
    }
}
