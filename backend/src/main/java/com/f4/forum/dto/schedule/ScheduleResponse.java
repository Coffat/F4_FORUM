package com.f4.forum.dto.schedule;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Room;
import com.f4.forum.entity.Schedule;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ScheduleResponse {
    private Long id;
    private Long classId;
    private String className;
    private Long roomId;
    private String roomName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isOnline;
    private String meetingLink;

    public static ScheduleResponse fromEntity(Schedule schedule) {
        Room room = schedule.getRoom();
        ClassEntity cls = schedule.getClassEntity();

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .classId(cls != null ? cls.getId() : null)
                .className(cls != null ? 
                        (cls.getCourse() != null ? "[" + cls.getClassCode() + "] " + cls.getCourse().getName() : cls.getClassCode())
                        : null)
                .roomId(room != null ? room.getId() : null)
                .roomName(room != null ? room.getName() : null)
                .date(schedule.getDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .isOnline(schedule.getIsOnline())
                .meetingLink(schedule.getMeetingLink())
                .build();
    }
}
