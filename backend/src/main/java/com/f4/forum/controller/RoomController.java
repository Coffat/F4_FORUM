package com.f4.forum.controller;

import com.f4.forum.dto.RoomCommand;
import com.f4.forum.entity.Room;
import com.f4.forum.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches/{branchId}/rooms")
@RequiredArgsConstructor
@Tag(name = "Room Management", description = "API quản lý phòng học bên trong chi nhánh")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    @Operation(summary = "Lấy danh sách phòng thuộc chi nhánh", description = "Trả về danh sách tất cả các phòng của một chi nhánh dựa trên branchId.")
    public List<Room> getAllRoomsByBranchId(@PathVariable Long branchId) {
        return roomService.findAllByBranchId(branchId);
    }

    @PostMapping
    @Operation(summary = "Tạo phòng học mới tại chi nhánh", description = "Khởi tạo một phòng học mới gắn với branchId cụ thể.")
    @ApiResponse(responseCode = "200", description = "Tạo thành công",
                 content = @Content(schema = @Schema(implementation = Room.class)))
    public Room createRoom(@PathVariable Long branchId, @RequestBody RoomCommand command) {
        return roomService.create(branchId, command);
    }

    @PutMapping("/{roomId}")
    @Operation(summary = "Cập nhật thông tin phòng học", description = "Cập nhật tên, sức chứa và loại phòng dựa trên roomId.")
    public Room updateRoom(@PathVariable Long branchId, @PathVariable Long roomId, @RequestBody RoomCommand command) {
        return roomService.update(roomId, command);
    }

    @DeleteMapping("/{roomId}")
    @Operation(summary = "Xóa phòng học", description = "Xóa hoàn toàn phòng học khỏi hệ thống.")
    public void deleteRoom(@PathVariable Long branchId, @PathVariable Long roomId) {
        roomService.delete(roomId);
    }
}
