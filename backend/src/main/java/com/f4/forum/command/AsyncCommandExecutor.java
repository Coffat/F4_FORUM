package com.f4.forum.command;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executors;

@Component
@RequiredArgsConstructor
@Slf4j
public class AsyncCommandExecutor {

    private final CommandHistory commandHistory;

    public <T> CompletableFuture<T> executeAsync(Command<T> command) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("🚀 [ASYNC COMMAND] Starting: {} - {}", 
                        command.getCommandName(), command.getCommandId());
                
                T result = command.execute();
                
                commandHistory.record(command);
                
                log.info("✅ [ASYNC COMMAND] Completed: {} - {}", 
                        command.getCommandName(), command.getCommandId());
                
                return result;
            } catch (Exception e) {
                log.error("❌ [ASYNC COMMAND] Failed: {} - {} - Error: {}", 
                        command.getCommandName(), command.getCommandId(), e.getMessage());
                throw new CompletionException(e);
            }
        }, Executors.newVirtualThreadPerTaskExecutor());
    }

    public <T> CompletableFuture<Void> executeAllAsync(List<Command<T>> commands) {
        List<CompletableFuture<T>> futures = commands.stream()
                .map(this::executeAsync)
                .collect(java.util.stream.Collectors.toList());
        
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
    }
}
