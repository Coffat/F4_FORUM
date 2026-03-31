package com.f4.forum.controller;

import com.f4.forum.dto.schedule.CreateScheduleCommand;
import com.f4.forum.dto.schedule.ScheduleResponse;
import com.f4.forum.dto.schedule.UpdateScheduleCommand;
import com.f4.forum.facade.StaffScheduleFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/schedules")
@RequiredArgsConstructor
@Tag(name = "Staff Schedule API")
public class StaffScheduleController {

    private final StaffScheduleFacade facade;

    @GetMapping
    @Operation(summary = "Get schedules by date range")
    public ResponseEntity<List<ScheduleResponse>> getSchedules(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(facade.getSchedules(start, end));
    }

    @PostMapping
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ScheduleResponse> createSchedule(@Valid @RequestBody CreateScheduleCommand command) {
        return ResponseEntity.ok(facade.createSchedule(command));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing schedule")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody UpdateScheduleCommand command) {
        command.setId(id);
        return ResponseEntity.ok(facade.updateSchedule(command));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a schedule")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        facade.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }
}
