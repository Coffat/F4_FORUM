package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "materials")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "material_type", length = 50)
    private String materialType;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "upload_date")
    private LocalDate uploadDate;

    public void updateBasics(String title, String description, String fileUrl) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề tài liệu không được để trống!");
        }
        this.title = title.trim();
        this.description = (description == null || description.isBlank()) ? null : description.trim();
        if (fileUrl != null) {
            this.fileUrl = fileUrl;
        }
        this.uploadDate = LocalDate.now();
    }

    public void updateDetails(String title, String materialType, String fileUrl) {
        this.title = title;
        this.materialType = materialType;
        this.fileUrl = fileUrl;
    }
}
