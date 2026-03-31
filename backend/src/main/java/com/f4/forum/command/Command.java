package com.f4.forum.command;

/**
 * ===== COMMAND PATTERN =====
 * Interface định nghĩa cấu trúc của một Command.
 * Mỗi Command có execute() để thực thi và undo() để rollback.
 * 
 * @param <T> Kiểu trả về sau khi thực thi
 */
public interface Command<T> {
    
    /**
     * Thực thi command và trả về kết quả.
     */
    T execute();
    
    /**
     * Hoàn tác command đã thực thi (rollback).
     */
    void undo();
    
    /**
     * Mô tả command cho logging.
     */
    default String getDescription() {
        return this.getClass().getSimpleName();
    }
}
