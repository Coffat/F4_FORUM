package com.f4.forum.security;

import com.f4.forum.repository.UserAccountRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Senior Backend Architecture - Security Layer.
 * Filter dùng để giải mã Token (Mock) và xác thực người dùng cho mọi Request.
 * Tận dụng Database để lấy Role thực thụ thay vì hardcode.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserAccountRepository userAccountRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Trích xuất Authorization Header từ Request
        String authHeader = request.getHeader("Authorization");
        
        // 2. Kiểm tra định dạng Token Bearer
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // 3. Giải mã Mock Token: Cấu trúc "eyJ...mock_token_for_[username]"
            if (token.contains("mock_token_for_")) {
                String username = token.substring(token.lastIndexOf("_") + 1);
                
                // 4. Lấy thông tin tài khoản từ DB để nạp vào Context (Xử lý role thật)
                userAccountRepository.findByUsername(username).ifPresent(account -> {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        account.getUsername(),
                        null,
                        List.of(new SimpleGrantedAuthority(account.getRole().name()))
                    );
                    
                    // Thiết lập SecurityContext - Spring Security bây giờ sẽ biết "Bạn là ai"
                    SecurityContextHolder.getContext().setAuthentication(auth);
                });
            }
        }
        
        // 5. Tiếp tục chuỗi Filter
        filterChain.doFilter(request, response);
    }
}
