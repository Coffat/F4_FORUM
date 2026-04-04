package com.f4.forum.adapter;

import java.util.Map;

/**
 * ===== ADAPTER PATTERN =====
 * Interface chung cho tất cả external services.
 * Đảm bảo tất cả external calls đều được wrap qua adapter.
 * 
 * @param <T> Kiểu response trả về
 */
public interface ExternalServiceAdapter<T> {
    
    /**
     * Gọi external service với params.
     */
    T call(Map<String, Object> params);
    
    /**
     * Kiểm tra service có available không.
     */
    boolean isAvailable();
    
    /**
     * Lấy tên service.
     */
    String getServiceName();
}
