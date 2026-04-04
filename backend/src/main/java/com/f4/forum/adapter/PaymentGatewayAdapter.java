package com.f4.forum.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/**
 * ===== ADAPTER PATTERN =====
 * Adapter thanh toán. Wrap tất cả external payment calls.
 * Trong thực tế sẽ tích hợp với Stripe, PayPal, VNPay...
 */
@Slf4j
@Component
public class PaymentGatewayAdapter implements ExternalServiceAdapter<String> {

    @Override
    public String call(Map<String, Object> params) {
        BigDecimal amount = (BigDecimal) params.get("amount");
        String currency = (String) params.getOrDefault("currency", "VND");
        String orderId = (String) params.get("orderId");
        
        log.info("💳 [ADAPTER] Xử lý thanh toán: {} {} cho order {}", amount, currency, orderId);
        
        // Simulate payment processing
        String transactionId = processPayment(amount, currency, orderId);
        
        return transactionId;
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public String getServiceName() {
        return "PaymentGateway";
    }

    private String processPayment(BigDecimal amount, String currency, String orderId) {
        // Simulate successful payment
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("✅ Payment successful: transactionId={}, amount={} {}", transactionId, amount, currency);
        return transactionId;
    }
}
