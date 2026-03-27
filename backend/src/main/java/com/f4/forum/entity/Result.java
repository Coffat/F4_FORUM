package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false, unique = true)
    private Enrollment enrollment;

    @Column(name = "midterm_score", precision = 5, scale = 2)
    private BigDecimal midtermScore;

    @Column(name = "final_score", precision = 5, scale = 2)
    private BigDecimal finalScore;

    @Column(length = 10)
    private String grade;

    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;

    @Version
    private Long version;

    public void updateScores(BigDecimal midterm, BigDecimal finalScore, String grade, String comment) {
        this.midtermScore = midterm;
        this.finalScore = finalScore;
        this.grade = grade;
        this.teacherComment = comment;
    }
}
