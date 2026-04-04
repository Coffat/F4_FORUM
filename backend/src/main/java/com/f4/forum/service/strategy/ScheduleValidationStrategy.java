package com.f4.forum.service.strategy;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;

public interface ScheduleValidationStrategy {
    void validateCreate(CreateScheduleCommand command);
    void validateUpdate(UpdateScheduleCommand command, Long excludeScheduleId);
}
