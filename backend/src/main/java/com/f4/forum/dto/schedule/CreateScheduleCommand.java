package com.f4.forum.dto.schedule;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.validation.constraints.NotNull;

@Data
public class CreateScheduleCommand {
    @NotNull(message = "classId is required")
    private Long classId;
    
    // Optional if online
    private Long roomId;
    
    @NotNull(message = "date is required")
    private LocalDate date;
    
    @NotNull(message = "startTime is required")
    private LocalTime startTime;
    
    @NotNull(message = "endTime is required")
    private LocalTime endTime;
    
    private Boolean isOnline;
    private String meetingLink;
}
