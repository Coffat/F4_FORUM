package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "attendances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"schedule_id", "enrollment_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Column(name = "is_present")
    private Boolean isPresent;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    // Rich Domain Model
    public void markPresent(String remarks) {
        this.isPresent = true;
        this.remarks = remarks;
    }

    public void markAbsent(String remarks) {
        this.isPresent = false;
        this.remarks = remarks;
    }
}
