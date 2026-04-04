package com.f4.forum.service;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.ScheduleResponse;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Room;
import com.f4.forum.entity.Schedule;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.RoomRepository;
import com.f4.forum.repository.ScheduleRepository;
import com.f4.forum.service.strategy.OfflineScheduleStrategy;
import com.f4.forum.service.strategy.OnlineScheduleStrategy;
import com.f4.forum.service.strategy.ScheduleValidationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ClassRepository classRepository;
    private final RoomRepository roomRepository;
    private final OfflineScheduleStrategy offlineStrategy;
    private final OnlineScheduleStrategy onlineStrategy;

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedules(LocalDate start, LocalDate end) {
        return scheduleRepository.findByDateBetween(start, end).stream()
                .map(ScheduleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleResponse createSchedule(CreateScheduleCommand command) {
        // Validate Time
        if (command.getStartTime().isAfter(command.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Strategy Selection
        ScheduleValidationStrategy strategy = Boolean.TRUE.equals(command.getIsOnline()) 
                ? onlineStrategy : offlineStrategy;
        
        strategy.validateCreate(command);

        ClassEntity classEntity = classRepository.findById(command.getClassId())
                .orElseThrow(() -> new IllegalArgumentException("Class not found"));

        Room room = null;
        if (Boolean.FALSE.equals(command.getIsOnline())) {
            room = roomRepository.findById(command.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        }

        Schedule schedule = Schedule.builder()
                .classEntity(classEntity)
                .room(room)
                .date(command.getDate())
                .startTime(command.getStartTime())
                .endTime(command.getEndTime())
                .isOnline(command.getIsOnline())
                .meetingLink(command.getMeetingLink())
                .build();

        return ScheduleResponse.fromEntity(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleResponse updateSchedule(UpdateScheduleCommand command) {
        // Validate Time
        if (command.getStartTime().isAfter(command.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Schedule schedule = scheduleRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));

        // Strategy Selection
        ScheduleValidationStrategy strategy = Boolean.TRUE.equals(command.getIsOnline()) 
                ? onlineStrategy : offlineStrategy;
                
        strategy.validateUpdate(command, schedule.getId());

        Schedule.ScheduleBuilder<?, ?> builder = schedule.toBuilder()
                .date(command.getDate())
                .startTime(command.getStartTime())
                .endTime(command.getEndTime())
                .isOnline(command.getIsOnline());

        if (Boolean.TRUE.equals(command.getIsOnline())) {
            builder.room(null).meetingLink(command.getMeetingLink());
        } else {
            Room room = roomRepository.findById(command.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
            builder.room(room).meetingLink(null);
        }

        Schedule updatedSchedule = builder.build();
        return ScheduleResponse.fromEntity(scheduleRepository.save(updatedSchedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Schedule not found");
        }
        scheduleRepository.deleteById(id);
    }
}
