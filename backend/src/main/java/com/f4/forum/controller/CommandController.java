package com.f4.forum.controller;

import com.f4.forum.command.AsyncCommandExecutor;
import com.f4.forum.command.Command;
import com.f4.forum.command.CommandFactory;
import com.f4.forum.command.CommandHistory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/commands")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Command Management", description = "APIs for command execution and history")
public class CommandController {

    private final CommandFactory commandFactory;
    private final AsyncCommandExecutor asyncCommandExecutor;
    private final CommandHistory commandHistory;

    @PostMapping("/execute")
    @Operation(summary = "Execute command synchronously")
    @ApiResponse(responseCode = "200", description = "Command executed successfully")
    public ResponseEntity<Map<String, Object>> executeCommand(
            @RequestParam String commandType,
            @RequestParam(required = false) Long invoiceId,
            @RequestParam(required = false) String amount) {
        
        Command<?> command = commandFactory.createCommand(
                commandType, 
                invoiceId, 
                amount != null ? new BigDecimal(amount) : null
        );
        
        Object result = command.execute();
        commandHistory.record(command);
        
        return ResponseEntity.ok(Map.of(
                "commandId", command.getCommandId(),
                "commandName", command.getCommandName(),
                "status", "COMPLETED",
                "result", result != null ? result : "null"
        ));
    }

    @PostMapping("/execute-async")
    @Operation(summary = "Execute command asynchronously")
    @ApiResponse(responseCode = "202", description = "Command queued for execution")
    public ResponseEntity<Map<String, Object>> executeCommandAsync(
            @RequestParam String commandType,
            @RequestParam(required = false) Long invoiceId,
            @RequestParam(required = false) String amount) {
        
        Command<?> command = commandFactory.createCommand(
                commandType, 
                invoiceId, 
                amount != null ? new BigDecimal(amount) : null
        );
        
        asyncCommandExecutor.executeAsync(command);
        
        return ResponseEntity.accepted().body(Map.of(
                "commandId", command.getCommandId(),
                "commandName", command.getCommandName(),
                "status", "QUEUED",
                "message", "Command is being executed asynchronously"
        ));
    }

    @GetMapping("/history")
    @Operation(summary = "Get command history")
    @ApiResponse(responseCode = "200", description = "Command history retrieved")
    public ResponseEntity<List<Command<?>>> getHistory() {
        return ResponseEntity.ok(commandHistory.getHistory());
    }

    @GetMapping("/history/{commandId}")
    @Operation(summary = "Get specific command by ID")
    @ApiResponse(responseCode = "200", description = "Command found")
    public ResponseEntity<?> getCommand(@PathVariable String commandId) {
        Command<?> command = commandHistory.getCommand(commandId);
        if (command == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "commandId", command.getCommandId(),
                "commandName", command.getCommandName(),
                "timestamp", command.getTimestamp().toString()
        ));
    }

    @DeleteMapping("/history")
    @Operation(summary = "Clear command history")
    @ApiResponse(responseCode = "200", description = "History cleared")
    public ResponseEntity<Map<String, String>> clearHistory() {
        commandHistory.clear();
        return ResponseEntity.ok(Map.of("status", "CLEARED"));
    }
}
