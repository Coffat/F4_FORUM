package com.f4.forum.command;

/**
 * ===== COMMAND PATTERN =====
 * Interface định nghĩa các hành vi của một Command object.
 * Đóng gói request thành object để dễ dàng xử lý, log, hoặc thực thi bất đồng bộ.
 */
public interface Command<T> {
    
    /**
     * Thực thi command.
     */
    T execute();
    
    /**
     * Lấy tên command.
     */
    String getCommandName();
    
    /**
     * Lấy timestamp khi command được tạo.
     */
    java.time.Instant getTimestamp();
    
    /**
     * Lấy ID của command.
     */
    String getCommandId();
}
