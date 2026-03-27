package com.f4.forum.entity;

import com.f4.forum.entity.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher grader;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private SubmissionStatus status;

    @Version
    private Long version;
    
    // Rich Domain Model
    public void grade(BigDecimal score, Teacher grader, String comment) {
        this.score = score;
        this.grader = grader;
        this.teacherComment = comment;
        this.status = SubmissionStatus.GRADED;
    }
}
