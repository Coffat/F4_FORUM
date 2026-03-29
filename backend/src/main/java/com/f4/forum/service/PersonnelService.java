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

    public List<StaffDirectoryResponse> getStaffDirectory() {
        List<Teacher> teachers = teacherRepository.findAllTeachersWithAccount();
        List<StaffMember> staffMembers = staffMemberRepository.findAllStaffWithAccount();
        
        List<StaffDirectoryResponse> response = new ArrayList<>();
        
        // Map Teachers
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
        
        // Map Staff Members
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
