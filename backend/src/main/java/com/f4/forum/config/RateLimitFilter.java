package com.f4.forum.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!isAuthEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIP(request);
        RateLimitInfo info = rateLimitMap.computeIfAbsent(clientIp, k -> new RateLimitInfo());

        if (info.tryConsume()) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
        }
    }

    private boolean isAuthEndpoint(HttpServletRequest request) {
        return request.getRequestURI().equals("/api/v1/auth/login");
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateLimitInfo {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long lastResetTime = System.currentTimeMillis();

        public synchronized boolean tryConsume() {
            long now = System.currentTimeMillis();
            if (now - lastResetTime > 60_000) {
                count.set(0);
                lastResetTime = now;
            }
            if (count.get() < MAX_REQUESTS_PER_MINUTE) {
                count.incrementAndGet();
                return true;
            }
            return false;
        }
    }
}
