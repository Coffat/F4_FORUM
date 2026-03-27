package com.f4.forum.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "staff_members")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class StaffMember extends User {
    private String department;
    
    // Rich Domain Model
    public void transferDepartment(String newDepartment) {
        this.department = newDepartment;
    }
}
