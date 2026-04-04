package com.f4.forum.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * ===== ADAPTER PATTERN =====
 * Adapter gửi email. Wrap tất cả external email calls.
 * Trong thực tế sẽ tích hợp với SendGrid, Mailgun, AWS SES...
 */
@Slf4j
@Component
public class EmailServiceAdapter implements ExternalServiceAdapter<Boolean> {

    @Override
    public Boolean call(Map<String, Object> params) {
        String to = (String) params.get("to");
        String subject = (String) params.get("subject");
        String body = (String) params.get("body");
        
        log.info("📧 [ADAPTER] Gửi email đến: {}, subject: {}", to, subject);
        
        // Simulate email sending
        simulateEmailSending(to, subject, body);
        
        return true;
    }

    @Override
    public boolean isAvailable() {
        // Kiểm tra email service availability
        return true;
    }

    @Override
    public String getServiceName() {
        return "EmailService";
    }

    private void simulateEmailSending(String to, String subject, String body) {
        log.debug("Email content: {} ...", body != null ? body.substring(0, Math.min(50, body.length())) : "empty");
    }
}
