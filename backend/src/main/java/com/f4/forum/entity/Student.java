package com.f4.forum.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Student extends User {
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "target_score", precision = 5, scale = 2)
    private BigDecimal targetScore;

    // Rich Domain Model
    public void updateAccountProfile(String address, String phone, String avatarUrl, LocalDate dob, String email) {
        this.address = address;
        this.dateOfBirth = dob;
        super.updatePersonalData(phone, avatarUrl, email);
    }

    /**
     * Cập nhật mục tiêu điểm IELTS của học viên.
     * Business Invariant: Điểm IELTS phải từ 0.0 đến 9.0.
     */
    public void updateTargetScore(BigDecimal targetScore) {
        if (targetScore != null && (targetScore.compareTo(BigDecimal.ZERO) < 0 || targetScore.compareTo(new BigDecimal("9.0")) > 0)) {
            throw new IllegalArgumentException("Điểm mục tiêu IELTS phải nằm trong khoảng [0.0 - 9.0]");
        }
        this.targetScore = targetScore;
    }
}
