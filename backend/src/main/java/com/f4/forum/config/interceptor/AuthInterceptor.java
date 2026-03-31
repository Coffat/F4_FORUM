package com.f4.forum.config.interceptor;

import com.f4.forum.exception.ValidationException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String TOKEN_ATTRIBUTE = "extractedToken";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length()).trim();
            if (!token.isEmpty()) {
                request.setAttribute(TOKEN_ATTRIBUTE, token);
                return true;
            }
        }
        
        throw new ValidationException("Thiếu Authorization Bearer token!");
    }
}
