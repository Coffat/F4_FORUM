package com.f4.forum.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BranchEventListener {

    @Async
    @EventListener
    public void handleBranchStatusChange(BranchStatusChangedEvent event) {
        log.info("🔔 [Observer] Chi nhánh '{}' (ID: {}) chuyển trạng thái: {} -> {}", 
                event.getBranchName(), 
                event.getBranchId(), 
                event.getOldStatus(), 
                event.getNewStatus());
        
        // Có thể mở rộng để gửi Email hoặc Notification tại đây (Adapter Pattern)
    }
}
