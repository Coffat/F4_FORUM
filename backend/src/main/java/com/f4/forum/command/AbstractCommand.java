package com.f4.forum.command;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * ===== ABSTRACT COMMAND =====
 * Base class cho tất cả Commands.
 * Cung cấp cơ chế logging và undo tracking.
 * 
 * @param <T> Kiểu trả về
 */
@Getter
@Slf4j
public abstract class AbstractCommand<T> implements Command<T> {

    private long executionTime;
    private boolean executed = false;
    private boolean undone = false;

    @Override
    public final T execute() {
        if (executed) {
            log.warn("Command {} đã được execute trước đó, bỏ qua...", getDescription());
            return getResult();
        }
        
        long start = System.currentTimeMillis();
        log.info("▶ Bắt đầu thực thi Command: {}", getDescription());
        
        T result = doExecute();
        
        executionTime = System.currentTimeMillis() - start;
        executed = true;
        
        log.info("✅ Hoàn thành Command: {} trong {}ms", getDescription(), executionTime);
        return result;
    }

    @Override
    public final void undo() {
        if (!executed) {
            log.warn("Command {} chưa được execute, không thể undo", getDescription());
            return;
        }
        
        if (undone) {
            log.warn("Command {} đã được undo trước đó", getDescription());
            return;
        }
        
        log.info("↩️ Bắt đầu undo Command: {}", getDescription());
        doUndo();
        undone = true;
        log.info("✅ Hoàn thành undo Command: {}", getDescription());
    }

    /**
     * Method trừu tượng subclasses phải implement để thực thi business logic.
     */
    protected abstract T doExecute();

    /**
     * Method trừu tượng subclasses phải implement để rollback.
     */
    protected abstract void doUndo();

    /**
     * Lấy kết quả đã lưu (nếu command đã execute).
     */
    protected abstract T getResult();
}
