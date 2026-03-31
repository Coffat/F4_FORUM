package com.f4.forum.dto.request;

import com.f4.forum.entity.enums.CourseStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStaffCourseCommand {

    @NotBlank(message = "Tên khóa học không được để trống")
    private String name;

    private String description;

    @NotBlank(message = "Category không được để trống")
    private String category;

    private String level;

    @NotNull(message = "Status không được để trống")
    private CourseStatus status;

    @Min(value = 1, message = "Enrollment tối đa phải từ 1 trở lên")
    private Integer maxEnrollment;

    private String imageUrl;
    
    private String imageColor;
}
