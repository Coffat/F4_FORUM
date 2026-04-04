package com.f4.forum.command;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;

@Component
@Slf4j
public class CommandHistory {

    private static final int MAX_HISTORY_SIZE = 1000;
    private final ConcurrentLinkedQueue<Command<?>> history = new ConcurrentLinkedQueue<>();
    private final Map<String, Command<?>> commandMap = new ConcurrentHashMap<>();

    public void record(Command<?> command) {
        history.add(command);
        commandMap.put(command.getCommandId(), command);
        
        while (history.size() > MAX_HISTORY_SIZE) {
            Command<?> oldest = history.poll();
            if (oldest != null) {
                commandMap.remove(oldest.getCommandId());
            }
        }
        
        log.debug("📝 [COMMAND HISTORY] Recorded: {} - {}", 
                command.getCommandName(), command.getCommandId());
    }

    public List<Command<?>> getHistory() {
        return Collections.unmodifiableList(history.stream().toList());
    }

    public List<Command<?>> getHistoryByName(String commandName) {
        return history.stream()
                .filter(c -> c.getCommandName().equals(commandName))
                .collect(Collectors.toList());
    }

    public Command<?> getCommand(String commandId) {
        return commandMap.get(commandId);
    }

    public List<Command<?>> getHistoryBetween(Instant start, Instant end) {
        return history.stream()
                .filter(c -> !c.getTimestamp().isBefore(start) && !c.getTimestamp().isAfter(end))
                .collect(Collectors.toList());
    }

    public int getHistorySize() {
        return history.size();
    }

    public void clear() {
        history.clear();
        commandMap.clear();
        log.info("🗑️ [COMMAND HISTORY] Cleared");
    }
}
