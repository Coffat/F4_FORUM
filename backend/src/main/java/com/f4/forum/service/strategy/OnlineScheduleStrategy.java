package com.f4.forum.service.strategy;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;
import org.springframework.stereotype.Component;

@Component
public class OnlineScheduleStrategy implements ScheduleValidationStrategy {

    @Override
    public void validateCreate(CreateScheduleCommand command) {
        if (command.getMeetingLink() == null || command.getMeetingLink().trim().isEmpty()) {
            throw new IllegalArgumentException("Meeting link is required for online schedule");
        }
    }

    @Override
    public void validateUpdate(UpdateScheduleCommand command, Long excludeScheduleId) {
        if (command.getMeetingLink() == null || command.getMeetingLink().trim().isEmpty()) {
            throw new IllegalArgumentException("Meeting link is required for online schedule");
        }
    }
}
