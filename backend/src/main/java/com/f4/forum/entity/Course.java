package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "courses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String level;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal fee;

    @Version
    private Long version;

    // Rich Domain Model
    public void updateFee(BigDecimal newFee) {
        if (newFee.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Fee cannot be negative");
        }
        this.fee = newFee;
    }
}
