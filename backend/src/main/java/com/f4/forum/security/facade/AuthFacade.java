package com.f4.forum.security.facade;

import com.f4.forum.dto.LoginRequest;
import com.f4.forum.dto.LoginResponse;
import com.f4.forum.security.event.LoginSuccessEvent;
import com.f4.forum.security.strategy.AuthStrategy;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Facade Pattern & Pipeline: Điểm chạm duy nhất của Module Xác thực. 
 * Điều phối mọi flow của việc xác thực.
 */
@Service
public class AuthFacade {

    private final List<AuthStrategy> strategies;
    private final ApplicationEventPublisher eventPublisher;

    public AuthFacade(List<AuthStrategy> strategies, ApplicationEventPublisher eventPublisher) {
        this.strategies = strategies;
        this.eventPublisher = eventPublisher;
    }

    public LoginResponse login(String authType, LoginRequest request) {
        // 1. Màng lọc điều kiện & Phân tích (Sẽ sử dụng Annotation Validation ở Controller là chủ yếu)
        if (request.username() == null || request.password() == null) {
            throw new IllegalArgumentException("Username và Password không được trống");
        }

        // 2. Lựa chọn Logic (Factory/Strategy pattern) tuỳ vào authType (LOCAL, GOOGLE...)
        AuthStrategy strategy = strategies.stream()
                .filter(s -> s.supports(authType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không hỗ trợ phương thức xác thực: " + authType));

        // 3. Xử lý lõi (Core processing)
        LoginResponse response = strategy.authenticate(request);

        // 4. Hậu xử lý (Observer Pattern) - Bắn event đăng nhập thành công
        eventPublisher.publishEvent(new LoginSuccessEvent(this, response.username()));

        return response;
    }
}
