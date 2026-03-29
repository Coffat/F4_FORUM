package com.f4.forum.service;

import com.f4.forum.dto.response.StaffDirectoryResponse;
import com.f4.forum.dto.response.StaffStatsResponse;
import com.f4.forum.entity.StaffMember;
import com.f4.forum.entity.Teacher;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.StaffMemberRepository;
import com.f4.forum.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class PersonnelService {
    
    private final TeacherRepository teacherRepository;
    private final StaffMemberRepository staffMemberRepository;
    private final ClassRepository classRepository;

    public PersonnelService(TeacherRepository teacherRepository, 
                            StaffMemberRepository staffMemberRepository, 
                            ClassRepository classRepository) {
        this.teacherRepository = teacherRepository;
        this.staffMemberRepository = staffMemberRepository;
        this.classRepository = classRepository;
    }

    /**
     * Danh sách giáo viên + nhân sự; có thể lọc theo từ khóa (tên, email, SĐT, specialty/department) và theo phân khúc (tab UI).
     */
    public List<StaffDirectoryResponse> getStaffDirectory(String searchRaw, String segmentRaw) {
        List<StaffDirectoryResponse> response = buildFullDirectory();
        String search = normalizeSearch(searchRaw);
        String segment = normalizeSegment(segmentRaw);

        return response.stream()
                .filter(p -> matchesSearch(p, search))
                .filter(p -> matchesSegment(p, segment))
                .toList();
    }

    private static String normalizeSearch(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        return raw.trim().toLowerCase(Locale.ROOT);
    }

    private static String normalizeSegment(String raw) {
        if (raw == null || raw.isBlank()) {
            return "ALL";
        }
        String u = raw.trim().toUpperCase(Locale.ROOT);
        return switch (u) {
            case "ACADEMIC", "ADMINISTRATIVE", "ALL" -> u;
            default -> "ALL";
        };
    }

    private static boolean matchesSearch(StaffDirectoryResponse p, String q) {
        if (q == null) {
            return true;
        }
        boolean name = p.getName() != null && p.getName().toLowerCase(Locale.ROOT).contains(q);
        boolean email = p.getEmail() != null && !"N/A".equals(p.getEmail())
                && p.getEmail().toLowerCase(Locale.ROOT).contains(q);
        boolean phone = p.getPhone() != null && !"N/A".equals(p.getPhone())
                && p.getPhone().toLowerCase(Locale.ROOT).contains(q);
        boolean spec = p.getSpecialty() != null && p.getSpecialty().toLowerCase(Locale.ROOT).contains(q);
        return name || email || phone || spec;
    }

    private static boolean matchesSegment(StaffDirectoryResponse p, String segment) {
        return switch (segment) {
            case "ALL" -> true;
            case "ACADEMIC" -> p.getRoles().stream()
                    .anyMatch(r -> "TEACHER".equals(r.getLabel()));
            case "ADMINISTRATIVE" -> p.getRoles().stream()
                    .anyMatch(r -> "SUPPORT".equals(r.getLabel()) || "MANAGER".equals(r.getLabel()));
            default -> true;
        };
    }

    private List<StaffDirectoryResponse> buildFullDirectory() {
        List<Teacher> teachers = teacherRepository.findAllTeachersWithAccount();
        List<StaffMember> staffMembers = staffMemberRepository.findAllStaffWithAccount();

        List<StaffDirectoryResponse> response = new ArrayList<>();

        for (Teacher t : teachers) {
            List<StaffDirectoryResponse.RoleBadge> roles = new ArrayList<>();
            roles.add(new StaffDirectoryResponse.RoleBadge(
                    "T_" + t.getId(),
                    "TEACHER",
                    "bg-blue-50 text-blue-600"
            ));

            response.add(StaffDirectoryResponse.builder()
                    .id(t.getId())
                    .name(t.getFullName())
                    .joined("Joined " + (t.getHireDate() != null ? t.getHireDate().getYear() : "N/A"))
                    .avatar("https://i.pravatar.cc/150?u=" + t.getId())
                    .isActive("ACTIVE".equals(t.getStatus().name()))
                    .roles(roles)
                    .specialty(t.getSpecialty() != null ? t.getSpecialty() : "N/A")
                    .email(t.getEmail() != null ? t.getEmail() : "N/A")
                    .phone(t.getPhone() != null ? t.getPhone() : "N/A")
                    .build());
        }

        for (StaffMember s : staffMembers) {
            List<StaffDirectoryResponse.RoleBadge> roles = new ArrayList<>();
            roles.add(new StaffDirectoryResponse.RoleBadge(
                    "S_" + s.getId(),
                    "SUPPORT",
                    "bg-slate-100 text-slate-600"
            ));

            response.add(StaffDirectoryResponse.builder()
                    .id(s.getId())
                    .name(s.getFullName())
                    .joined("Joined " + (s.getCreatedAt() != null ? s.getCreatedAt().getYear() : "N/A"))
                    .avatar("https://i.pravatar.cc/150?u=" + s.getId())
                    .isActive("ACTIVE".equals(s.getStatus().name()))
                    .roles(roles)
                    .specialty(s.getDepartment() != null ? s.getDepartment() : "Administration")
                    .email(s.getEmail() != null ? s.getEmail() : "N/A")
                    .phone(s.getPhone() != null ? s.getPhone() : "N/A")
                    .build());
        }

        response.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        return response;
    }

    public StaffStatsResponse getStaffStats() {
        long totalTeachers = teacherRepository.count();
        long activeSessions = classRepository.countByStatusIn(List.of(ClassStatus.OPEN, ClassStatus.IN_PROGRESS));
        
        long activeTeachers = classRepository.countDistinctTeachersInActiveClasses(List.of(ClassStatus.OPEN, ClassStatus.IN_PROGRESS));
        long onDutyRatio = totalTeachers > 0 ? (activeTeachers * 100 / totalTeachers) : 0;
        
        return StaffStatsResponse.builder()
            .totalFaculty(totalTeachers)
            .activeSessions(activeSessions)
            .onDutyRatio(onDutyRatio + "%")
            .build();
    }
}
