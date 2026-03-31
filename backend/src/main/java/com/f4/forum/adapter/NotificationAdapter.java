package com.f4.forum.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * ===== ADAPTER PATTERN =====
 * Adapter gửi notification (Push, In-app).
 * Wrap tất cả external notification calls.
 */
@Slf4j
@Component
public class NotificationAdapter implements ExternalServiceAdapter<Boolean> {

    @Override
    public Boolean call(Map<String, Object> params) {
        String userId = (String) params.get("userId");
        String title = (String) params.get("title");
        String message = (String) params.get("message");
        String type = (String) params.getOrDefault("type", "INFO");
        
        log.info("🔔 [ADAPTER] Gửi notification đến user: {}, type: {}, title: {}", userId, type, title);
        
        // Simulate notification sending
        sendNotification(userId, title, message, type);
        
        return true;
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public String getServiceName() {
        return "NotificationService";
    }

    private void sendNotification(String userId, String title, String message, String type) {
        log.debug("Notification sent to user {}: [{}] {}", userId, type, title);
    }
}
