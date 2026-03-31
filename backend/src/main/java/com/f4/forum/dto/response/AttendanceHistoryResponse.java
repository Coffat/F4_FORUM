package com.f4.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceHistoryResponse {
    private LocalDate date;
    private int presentCount;
    private int absentCount;
}
