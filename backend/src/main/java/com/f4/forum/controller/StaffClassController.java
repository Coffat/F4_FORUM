package com.f4.forum.controller;

import com.f4.forum.dto.request.AddStudentToClassCommand;
import com.f4.forum.dto.response.AttendanceHistoryResponse;
import com.f4.forum.dto.response.AvailableStudentResponse;
import com.f4.forum.dto.response.ClassSummaryResponse;
import com.f4.forum.facade.StaffClassFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/classes")
@RequiredArgsConstructor
@Tag(name = "Staff Classes Management", description = "Các API cho Staff quản lý lớp học, sinh viên và điểm danh")
public class StaffClassController {

    private final StaffClassFacade staffClassFacade;

    @GetMapping
    @Operation(summary = "Lấy danh sách lớp học", description = "Lấy toàn bộ lớp học trong hệ thống")
    public ResponseEntity<List<ClassSummaryResponse>> getAllClasses() {
        return ResponseEntity.ok(staffClassFacade.getAllClasses());
    }

    @GetMapping("/{classId}/available-students")
    @Operation(summary = "Sinh viên có thể thêm vào lớp", description = "Lấy danh sách sinh viên chưa được đăng ký vào lớp này")
    public ResponseEntity<List<AvailableStudentResponse>> getAvailableStudents(@PathVariable Long classId) {
        return ResponseEntity.ok(staffClassFacade.getAvailableStudents(classId));
    }

    @PostMapping("/{classId}/students")
    @Operation(summary = "Thêm sinh viên vào lớp", description = "Đăng ký một sinh viên vào lớp học")
    public ResponseEntity<Void> addStudentToClass(
            @PathVariable Long classId,
            @RequestBody @Valid AddStudentToClassCommand command) {
        staffClassFacade.addStudentToClass(classId, command);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{classId}/attendance")
    @Operation(summary = "Xem lịch sử điểm danh", description = "Lấy lịch sử điểm danh theo từng buổi học của lớp")
    public ResponseEntity<List<AttendanceHistoryResponse>> getAttendanceHistory(@PathVariable Long classId) {
        return ResponseEntity.ok(staffClassFacade.getAttendanceHistory(classId));
    }
}
