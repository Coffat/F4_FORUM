package com.f4.forum.service.strategy;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;
import com.f4.forum.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OfflineScheduleStrategy implements ScheduleValidationStrategy {

    private final ScheduleRepository scheduleRepository;

    @Override
    public void validateCreate(CreateScheduleCommand command) {
        if (command.getRoomId() == null) {
            throw new IllegalArgumentException("Room must be selected for offline schedule");
        }
        
        boolean hasConflict = scheduleRepository.existsConflictingSchedule(
                command.getRoomId(),
                command.getDate(),
                command.getStartTime(),
                command.getEndTime()
        );
        
        if (hasConflict) {
            throw new IllegalArgumentException("Room is already occupied during this time");
        }
    }

    @Override
    public void validateUpdate(UpdateScheduleCommand command, Long excludeScheduleId) {
        if (command.getRoomId() == null) {
            throw new IllegalArgumentException("Room must be selected for offline schedule");
        }
        
        boolean hasConflict = scheduleRepository.existsConflictingScheduleExcludingId(
                command.getRoomId(),
                command.getDate(),
                command.getStartTime(),
                command.getEndTime(),
                excludeScheduleId
        );
        
        if (hasConflict) {
            throw new IllegalArgumentException("Room is already occupied during this time");
        }
    }
}
