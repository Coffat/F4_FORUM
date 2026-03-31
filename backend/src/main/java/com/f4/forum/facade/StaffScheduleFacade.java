package com.f4.forum.facade;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.ScheduleResponse;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;
import com.f4.forum.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffScheduleFacade {

    private final ScheduleService scheduleService;

    public List<ScheduleResponse> getSchedules(LocalDate start, LocalDate end) {
        return scheduleService.getSchedules(start, end);
    }

    public ScheduleResponse createSchedule(CreateScheduleCommand command) {
        return scheduleService.createSchedule(command);
    }

    public ScheduleResponse updateSchedule(UpdateScheduleCommand command) {
        return scheduleService.updateSchedule(command);
    }

    public void deleteSchedule(Long id) {
        scheduleService.deleteSchedule(id);
    }
}
