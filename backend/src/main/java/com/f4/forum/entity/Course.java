package com.f4.forum.entity;

import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.exception.BusinessRuleViolationException;
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
    private String category;

    @Column(length = 50)
    private String level;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal fee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseStatus status;
    
    @Column(name = "max_enrollment")
    private Integer maxEnrollment;

    @Column(name = "current_enrollment")
    private Integer currentEnrollment;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "image_color", length = 30)
    private String imageColor;

    @Version
    private Long version;

    // Public setter for State Pattern
    public void setStatus(CourseStatus status) {
        this.status = status;
    }

    public void updateFee(BigDecimal newFee) {
        if (newFee.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Fee cannot be negative");
        }
        this.fee = newFee;
    }

    public void updateDetails(String name, String description, String category, String level, 
                              java.math.BigDecimal fee, Integer maxEnrollment, 
                              String imageUrl, String imageColor, CourseStatus status) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.level = level;
        this.updateFee(fee);
        this.maxEnrollment = maxEnrollment;
        this.imageUrl = imageUrl;
        this.imageColor = imageColor;
        this.status = status;
    }

    public void publish() {
        if (this.status == CourseStatus.ARCHIVED) {
            throw new BusinessRuleViolationException("Không thể xuất bản khóa học đã bị lưu trữ!");
        }
        this.status = CourseStatus.PUBLISHED;
    }

    public void updateDetailsByStaff(String name, String description, String category, String level, 
                                     Integer maxEnrollment, String imageUrl, String imageColor, CourseStatus status) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.level = level;
        this.maxEnrollment = maxEnrollment;
        this.imageUrl = imageUrl;
        this.imageColor = imageColor;
        this.status = status;
    }

    public void archive() {
        if (this.status == CourseStatus.ARCHIVED) {
            throw new BusinessRuleViolationException("Khóa học đã được lưu trữ trước đó!");
        }
        this.status = CourseStatus.ARCHIVED;
    }
}
