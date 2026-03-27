package com.f4.forum.security.strategy;

import com.f4.forum.dto.LoginRequest;
import com.f4.forum.dto.LoginResponse;

/**
 * Strategy Pattern: Định nghĩa giao diện chung cho các thuật toán xác thực (Username/Password, OAuth, v.v.).
 */
public interface AuthStrategy {
    boolean supports(String authType);
    LoginResponse authenticate(LoginRequest request);
}
