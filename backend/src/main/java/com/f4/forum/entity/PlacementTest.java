package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "placement_tests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class PlacementTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "test_date")
    private LocalDate testDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal listening;

    @Column(precision = 5, scale = 2)
    private BigDecimal speaking;

    @Column(precision = 5, scale = 2)
    private BigDecimal reading;

    @Column(precision = 5, scale = 2)
    private BigDecimal writing;

    @Column(precision = 5, scale = 2)
    private BigDecimal overall;

    @Column(name = "recommended_level", length = 50)
    private String recommendedLevel;
    
/*
    public void grade(BigDecimal score, String recommendedLevel) {
        this.overall = score;
        this.recommendedLevel = recommendedLevel;
    }
    */
}
