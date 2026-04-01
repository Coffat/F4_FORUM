package com.f4.forum.command;

import java.time.Instant;
import java.util.UUID;

/**
 * ===== COMMAND PATTERN - Abstract Command =====
 * Base class cho tất cả Commands.
 * Template Method pattern: execute() gọi doExecute() để subclasses implement logic.
 */
public abstract class AbstractCommand<T> implements Command<T> {
    
    private final Instant timestamp;
    private final String commandId;
    
    protected AbstractCommand() {
        this.timestamp = Instant.now();
        this.commandId = UUID.randomUUID().toString();
    }
    
    @Override
    public final T execute() {
        return doExecute();
    }
    
    @Override
    public String getCommandName() {
        return this.getClass().getSimpleName();
    }
    
    @Override
    public Instant getTimestamp() {
        return timestamp;
    }
    
    @Override
    public String getCommandId() {
        return commandId;
    }
    
    /**
     * Template method - subclasses implement business logic here.
     */
    protected abstract T doExecute();
    
    /**
     * Undo method - subclasses can override if undo is supported.
     */
    public void undo() {
        throw new UnsupportedOperationException("Undo not supported for " + getCommandName());
    }
    
    /**
     * Check if undo is supported.
     */
    public boolean canUndo() {
        return false;
    }
}
