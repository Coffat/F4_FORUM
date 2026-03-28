package com.f4.forum.service.factory;

import com.f4.forum.dto.request.CreateUserCommand;
import com.f4.forum.entity.StaffMember;
import com.f4.forum.entity.Student;
import com.f4.forum.entity.Teacher;
import com.f4.forum.entity.User;
import com.f4.forum.entity.enums.UserStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class UserFactory {

    public User createUser(CreateUserCommand cmd) {
        return switch (cmd.userType()) {
            case STUDENT -> Student.builder()
                    .fullName(cmd.fullName())
                    .email(cmd.email())
                    .phone(cmd.phone())
                    .status(UserStatus.ACTIVE)
                    .userType(cmd.userType())
                    .dateOfBirth(cmd.dateOfBirth())
                    .gender(cmd.gender())
                    .address(cmd.address())
                    .registrationDate(LocalDate.now())
                    .build();
            case TEACHER -> Teacher.builder()
                    .fullName(cmd.fullName())
                    .email(cmd.email())
                    .phone(cmd.phone())
                    .status(UserStatus.ACTIVE)
                    .userType(cmd.userType())
                    .specialty(cmd.specialty())
                    .hireDate(cmd.hireDate() != null ? cmd.hireDate() : LocalDate.now())
                    .build();
            case STAFF -> StaffMember.builder()
                    .fullName(cmd.fullName())
                    .email(cmd.email())
                    .phone(cmd.phone())
                    .status(UserStatus.ACTIVE)
                    .userType(cmd.userType())
                    .department(cmd.department())
                    .build();
            default -> throw new IllegalArgumentException("Unsupported UserType");
        };
    }
}
