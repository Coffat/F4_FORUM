package com.f4.forum.dto.response;

import java.time.Instant;
import java.util.Map;

public record ApiError(
    int status,
    String message,
    Map<String, String> fieldErrors,
    Instant timestamp
) {
    public static ApiError validation(String message) {
        return new ApiError(400, message, Map.of(), Instant.now());
    }

    public static ApiError notFound(String message) {
        return new ApiError(404, message, Map.of(), Instant.now());
    }

    public static ApiError unauthorized(String message) {
        return new ApiError(401, message, Map.of(), Instant.now());
    }

    public static ApiError forbidden(String message) {
        return new ApiError(403, message, Map.of(), Instant.now());
    }

    public static ApiError badRequest(String message) {
        return new ApiError(400, message, Map.of(), Instant.now());
    }

    public static ApiError of(String message) {
        return new ApiError(500, "Internal server error", Map.of(), Instant.now());
    }

    public static ApiError withFieldErrors(String message, Map<String, String> errors) {
        return new ApiError(400, message, errors, Instant.now());
    }
}
