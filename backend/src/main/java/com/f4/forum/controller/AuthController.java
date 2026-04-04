package com.f4.forum.controller;

import com.f4.forum.dto.LoginRequest;
import com.f4.forum.dto.LoginResponse;
import com.f4.forum.dto.response.ApiError;
import com.f4.forum.exception.UnauthorizedException;
import com.f4.forum.security.facade.AuthFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Các API liên quan đến Xác thực người dùng")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @Operation(summary = "Đăng nhập", description = "Đăng nhập trả về JWT token mô phỏng (Dành cho mọi loại User kể cả Admin/Staff/Student/Teacher)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công, trả về JWT Token và User Info",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Sai tài khoản hoặc mật khẩu",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for username: {}", request.username());
        LoginResponse response = authFacade.login("LOCAL", request);
        log.info("Login successful for username: {}", request.username());
        return ResponseEntity.ok(response);
    }
}
