package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "attachment_url", columnDefinition = "TEXT")
    private String attachmentUrl;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "max_score", precision = 5, scale = 2)
    private BigDecimal maxScore;
    
    public void extendDeadline(LocalDateTime newDueDate) {
        if (newDueDate.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Deadline must be in the future");
        }
        this.dueDate = newDueDate;
    }

    public void updateBasics(String title, String description, LocalDateTime dueDate, BigDecimal maxScore, String attachmentUrl) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề bài tập không được để trống!");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Mô tả bài tập không được để trống!");
        }
        if (maxScore != null && maxScore.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Điểm tối đa phải lớn hơn 0!");
        }
        this.title = title.trim();
        this.description = description.trim();
        if (dueDate != null) {
            this.dueDate = dueDate;
        }
        if (maxScore != null) {
            this.maxScore = maxScore;
        }
        this.attachmentUrl = attachmentUrl;
    }
}
