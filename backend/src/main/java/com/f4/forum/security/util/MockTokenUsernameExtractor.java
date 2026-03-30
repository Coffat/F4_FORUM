package com.f4.forum.security.util;

/**
 * Tiện ích tách username từ mock token hiện tại.
 * Token format: "eyJhbGciOiJIUzI1NiJ9.mock_token_for_<username>"
 */
public final class MockTokenUsernameExtractor {

    private static final String MARKER = "mock_token_for_";

    private MockTokenUsernameExtractor() {}

    public static String extractUsername(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Thiếu token");
        }

        int idx = token.indexOf(MARKER);
        if (idx < 0) {
            throw new IllegalArgumentException("Token không hợp lệ (mock token)");
        }

        String username = token.substring(idx + MARKER.length()).trim();
        if (username.isEmpty()) {
            throw new IllegalArgumentException("Token không hợp lệ (không có username)");
        }

        return username;
    }
}

