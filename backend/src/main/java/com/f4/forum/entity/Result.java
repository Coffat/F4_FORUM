package com.f4.forum.entity;

import com.f4.forum.exception.ValidationException;
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
        validateScore(midterm);
        validateScore(finalScore);
        this.midtermScore = midterm;
        this.finalScore = finalScore;
        this.grade = grade;
        this.teacherComment = comment;
    }

    private void validateScore(BigDecimal score) {
        if (score == null) return;
        if (score.compareTo(BigDecimal.ZERO) < 0 || score.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ValidationException("Điểm phải nằm trong khoảng 0-100!");
        }
    }
}
