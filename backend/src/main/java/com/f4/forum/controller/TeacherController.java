package com.f4.forum.controller;

import com.f4.forum.dto.response.TeacherProfileResponse;
import com.f4.forum.dto.response.TeacherOverviewResponse;
import com.f4.forum.service.TeacherProfileFacade;
import com.f4.forum.service.TeacherOverviewFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher Portal", description = "APIs phục vụ Teacher Portal (Profile, Classes, Schedule, ...)")
public class TeacherController {

    private final TeacherProfileFacade teacherProfileFacade;
    private final TeacherOverviewFacade teacherOverviewFacade;

    @GetMapping("/me")
    @Operation(
            summary = "Lấy hồ sơ giảng viên hiện tại",
            description = "Dành cho Teacher Portal. Hiện tại parse username từ mock token (mock_token_for_<username>)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về hồ sơ giảng viên"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền (chuỗi text lỗi)")
    })
    public ResponseEntity<?> getMyProfile(
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            TeacherProfileResponse response = teacherProfileFacade.getMyProfile(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/overview")
    @Operation(
            summary = "Lấy metrics tổng quan cho Teacher Profile",
            description = "Trả về 3 metrics: lớp đang dạy, bài chờ chấm, buổi dạy trong tuần. Parse username từ mock token."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về metrics"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền (chuỗi text lỗi)")
    })
    public ResponseEntity<?> getMyOverview(
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            TeacherOverviewResponse response = teacherOverviewFacade.getMyOverview(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

