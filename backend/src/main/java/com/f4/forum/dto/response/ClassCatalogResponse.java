package com.f4.forum.dto.response;

import com.f4.forum.entity.enums.ClassStatus;
import java.time.LocalDate;

/**
 * Response: Thông tin hiển thị danh sách Lớp học
 */
public record ClassCatalogResponse(
    Long id,
    String classCode,
    String courseName,
    String roomName,
    LocalDate startDate,
    LocalDate endDate,
    Integer maxStudents,
    Integer currentEnrollment,
    ClassStatus status
) {}
