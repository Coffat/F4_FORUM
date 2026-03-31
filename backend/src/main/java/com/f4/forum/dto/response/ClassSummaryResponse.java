package com.f4.forum.dto.response;

import com.f4.forum.entity.enums.ClassStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSummaryResponse {
    private Long id;
    private String classCode;
    private String courseName;
    private String schedule; // e.g., "Mon/Wed 18:00 - 20:00"
    private String room;
    private Integer enrollment;
    private Integer maxEnrollment;
    private ClassStatus status;
}
