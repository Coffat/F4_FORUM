package com.f4.forum.controller;

import com.f4.forum.entity.Room;
import com.f4.forum.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "Room Management", description = "API cho việc quản lý phòng học")
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả phòng học")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}
