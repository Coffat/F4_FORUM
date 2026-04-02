package com.f4.forum.controller;

import com.f4.forum.dto.command.UpdateStudentProfileCommand;
import com.f4.forum.dto.response.StudentDashboardResponse;
import com.f4.forum.dto.response.StudentProfileResponse;
import com.f4.forum.service.command.StudentCommandService;
import com.f4.forum.service.query.StudentQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller dành riêng cho các tính năng của Học viên.
 * Bảo mật: Chỉ cho phép ROLE_STUDENT truy cập.
 */
@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Tag(name = "Student Controller", description = "Các API dành riêng cho vai trò Học viên")
public class StudentController {

    private final StudentQueryService studentQueryService;
    private final StudentCommandService studentCommandService;

    /**
     * Endpoint lấy dữ liệu Dashboard cho Student.
     * Trích xuất thông tin an toàn từ Authentication để tránh IDOR.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Lấy dữ liệu Dashboard cho học viên", 
               description = "API này trả về thông tin cá nhân và danh sách các lớp học mà học viên đang đăng ký.")
    public StudentDashboardResponse getDashboard(Authentication authentication) {
        // authentication.getName() sẽ trả về username (mã định danh duy nhất) trong JWT Token
        String currentUsername = authentication.getName();
        return studentQueryService.getStudentDashboardByUsername(currentUsername);
    }

    /**
     * Endpoint lấy đầy đủ hồ sơ chi tiết (Profile) của Học viên.
     * Bảo mật cao: Không truyền ID qua URL, ID được giải mã từ JWT Token.
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Lấy hồ sơ chi tiết của học viên", 
               description = "API này trả về thông tin cá nhân, mục tiêu học tập, điểm đầu vào và các chứng chỉ của học viên.")
    public StudentProfileResponse getProfile(Authentication authentication) {
        String currentUsername = authentication.getName();
        return studentQueryService.getStudentProfileByUsername(currentUsername);
    }

    /**
     * Endpoint cập nhật hồ sơ Học viên.
     * Áp dụng Validation và Anti-IDOR Security.
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Cập nhật hồ sơ cá nhân", 
               description = "Cho phép học viên tự cập nhật Số điện thoại, Ngày sinh, Avatar và Điểm mục tiêu.")
    public ResponseEntity<String> updateProfile(Authentication authentication, 
                              @Valid @RequestBody UpdateStudentProfileCommand command) {
        String currentUsername = authentication.getName();
        studentCommandService.updateProfileByUsername(currentUsername, command);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }
}
