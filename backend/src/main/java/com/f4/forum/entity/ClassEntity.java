package com.f4.forum.entity;

import com.f4.forum.entity.enums.ClassStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "class_code", unique = true, nullable = false, length = 50)
    private String classCode;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private ClassStatus status = ClassStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_room_id")
    private Room defaultRoom;

    // Tính số học viên hiện tại trực tiếp bằng SQL subquery — tránh N+1
    @Formula("(SELECT COUNT(e.id) FROM enrollments e WHERE e.class_id = id AND e.status = 'ENROLLED')")
    private Integer currentEnrollment;

    // Quan hệ 1-Nhiều với Enrollment — dùng cho Rich Domain Methods (không load khi query danh sách)
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();

    // ==========================================
    // RICH DOMAIN MODEL - NGHIỆP VỤ LÕI
    // ==========================================

    /**
     * Hủy lớp học: Chỉ cho phép hủy nếu chưa có học viên nào được enroll.
     * Áp dụng nguyên lý Tell, Don't Ask.
     */
    public void cancelClass() {
        if (this.enrollments != null && !this.enrollments.isEmpty()) {
            throw new IllegalStateException("Không thể hủy lớp học đã có học viên ghi danh.");
        }
        this.status = ClassStatus.CANCELLED;
    }

    /**
     * Kiểm tra điều kiện cho phép ghi danh
     * @return true nếu Lớp có trạng thái OPEN và số sinh viên hiện tại < maxStudents
     */
    public boolean canEnroll() {
        int currentEnrollment = this.enrollments != null ? this.enrollments.size() : 0;
        return this.status == ClassStatus.OPEN && currentEnrollment < this.maxStudents;
    }
}
