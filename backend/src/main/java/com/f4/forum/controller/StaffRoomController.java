package com.f4.forum.controller;

import com.f4.forum.entity.Room;
import com.f4.forum.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/rooms")
@RequiredArgsConstructor
@Tag(name = "Staff Room API")
public class StaffRoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    @Operation(summary = "Get all rooms for scheduling")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }
}
