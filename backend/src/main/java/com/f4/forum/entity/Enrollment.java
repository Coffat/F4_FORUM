package com.f4.forum.entity;

import com.f4.forum.entity.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "class_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private EnrollmentStatus status;

    @OneToOne(mappedBy = "enrollment", cascade = CascadeType.ALL)
    private Result result;

    @Version
    private Long version;

    // Rich Domain Model: Xử lý thay đổi status hợp lệ
    public void dropCourse() {
        if (this.status == EnrollmentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot drop a completed course");
        }
        this.status = EnrollmentStatus.DROPPED;
    }
    
    public void complete() {
        this.status = EnrollmentStatus.COMPLETED;
    }
}
