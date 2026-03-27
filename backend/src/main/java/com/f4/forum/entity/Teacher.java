package com.f4.forum.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Teacher extends User {
    private String specialty;

    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    // Rich Domain Model
    public void updateSpecialty(String specialty) {
        this.specialty = specialty;
    }
}
