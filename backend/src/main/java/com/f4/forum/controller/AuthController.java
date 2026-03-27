package com.f4.forum.controller;

import com.f4.forum.dto.LoginRequest;
import com.f4.forum.dto.LoginResponse;
import com.f4.forum.security.facade.AuthFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Các API liên quan đến Xác thực người dùng")
public class AuthController {

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @Operation(summary = "Đăng nhập", description = "Đăng nhập trả về JWT token mô phỏng (Dành cho mọi loại User kể cả Admin/Staff/Student/Teacher)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công, trả về JWT Token và User Info",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "400", description = "Sai tài khoản hoặc mật khẩu (Chuỗi Text lỗi)",
                    content = @Content(mediaType = "text/plain"))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Đưa request vào Facade xử lý xuyên suốt theo Pipeline
            LoginResponse response = authFacade.login("LOCAL", request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
