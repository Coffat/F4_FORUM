package com.f4.forum.entity;

import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "classes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_room_id")
    private Room defaultRoom;

    @Column(name = "class_code", nullable = false, unique = true, length = 50)
    private String classCode;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ClassStatus status;

    @Builder.Default
    @ManyToMany
    @JoinTable(
        name = "class_teachers",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> teachers = new HashSet<>();

    @Version
    private Long version;

    public void addTeacher(Teacher teacher) {
        this.teachers.add(teacher);
    }

    public void removeTeacher(Teacher teacher) {
        this.teachers.remove(teacher);
    }

    public void cancelClass() {
        if (this.status == ClassStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Lớp học đã bị hủy trước đó!");
        }
        if (this.status == ClassStatus.CLOSED) {
            throw new BusinessRuleViolationException("Không thể hủy lớp học đã đóng!");
        }
        this.status = ClassStatus.CANCELLED;
    }
    
    public void startClass() {
        if (this.status == ClassStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Không thể bắt đầu lớp học đã bị hủy!");
        }
        if (this.status == ClassStatus.IN_PROGRESS) {
            throw new BusinessRuleViolationException("Lớp học đã đang diễn ra!");
        }
        if (LocalDate.now().isBefore(startDate)) {
            throw new BusinessRuleViolationException("Không thể bắt đầu lớp học trước ngày khai giảng!");
        }
        this.status = ClassStatus.IN_PROGRESS;
    }

    public void closeClass() {
        if (this.status == ClassStatus.CANCELLED) {
            throw new BusinessRuleViolationException("Không thể đóng lớp học đã bị hủy!");
        }
        this.status = ClassStatus.CLOSED;
    }
}
