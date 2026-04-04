package com.f4.forum.dto.response;

import com.f4.forum.entity.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCatalogResponse {
    private Long id;
    private String code;
    private String name;
    private String category;
    private Integer currentEnrollment;
    private Integer maxEnrollment;
    private BigDecimal fee;
    private CourseStatus status;
    private String imageUrl;
    private String imageColor;
    private String level;
}
