package com.f4.forum.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

/**
 * Command: Cập nhật Lớp học
 */
public record UpdateClassCommand(
    Long roomId,
    
    @NotNull(message = "Ngày bắt đầu là bắt buộc") 
    LocalDate startDate,
    
    @NotNull(message = "Ngày kết thúc là bắt buộc") 
    LocalDate endDate,
    
    @NotNull(message = "Số lượng sinh viên tối đa là bắt buộc") 
    @Positive(message = "Số lượng sinh viên phải lớn hơn 0") 
    Integer maxStudents
) {}
