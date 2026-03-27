package com.f4.forum.security.strategy;

import com.f4.forum.dto.LoginRequest;
import com.f4.forum.dto.LoginResponse;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Strategy Pattern (Implementation): Xử lý logic xác thực bằng Username và Password truyền thống.
 */
@Component
public class UsernamePasswordAuthStrategy implements AuthStrategy {
    
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UsernamePasswordAuthStrategy(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean supports(String authType) {
        return "LOCAL".equalsIgnoreCase(authType);
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        // Core Logic: Tìm user, check mk
        UserAccount account = userAccountRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (!passwordEncoder.matches(request.password(), account.getPasswordHash())) {
            throw new RuntimeException("Sai mật khẩu!");
        }

        // Mock token validation since we keep it simple, otherwise use JWT here
        String mockToken = "eyJhbGciOiJIUzI1NiJ9.mock_token_for_" + account.getUsername();

        return new LoginResponse(
                mockToken,
                account.getUsername(),
                account.getRole().name(),
                account.getUser().getFullName()
        );
    }
}
