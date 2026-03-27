package com.f4.forum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Thông tin khóa học")
public record CourseDTO(

    @Schema(description = "ID khóa học", example = "1")
    Long id,

    @Schema(description = "Mã khóa học", example = "IELTS-ADV")
    String code,

    @Schema(description = "Tên khóa học", example = "IELTS Advanced – Chinh Phục")
    String name,

    @Schema(description = "Mô tả khóa học")
    String description,

    @Schema(description = "Cấp độ (STARTER / ELEMENTARY / PRE-INTERMEDIATE / INTERMEDIATE / UPPER-INTERMEDIATE / ADVANCED / HIGH-ADVANCED / EXPERT)",
            example = "ADVANCED")
    String level,

    @Schema(description = "Học phí (VND)", example = "7200000.00")
    BigDecimal fee
) {}
