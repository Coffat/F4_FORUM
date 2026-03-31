package com.f4.forum.security.util;

import com.f4.forum.exception.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class TokenExtractor {

    public String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ValidationException("Thiếu Authorization Bearer token!");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
