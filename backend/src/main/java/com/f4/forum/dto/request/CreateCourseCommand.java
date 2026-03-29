package com.f4.forum.dto.request;

import com.f4.forum.entity.enums.CourseStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateCourseCommand {
    @NotBlank(message = "Course code is required")
    private String code;
    
    @NotBlank(message = "Course name is required")
    private String name;
    
    private String description;
    
    private String category;
    
    private String level;
    
    @NotNull(message = "Fee is required")
    @Min(value = 0, message = "Fee cannot be negative")
    private BigDecimal fee;
    
    @NotNull(message = "Status is required")
    private CourseStatus status;
    
    @Min(value = 1, message = "Max enrollment must be at least 1")
    private Integer maxEnrollment;
    
    private String imageUrl;
    
    private String imageColor;
}
