package com.f4.forum.event;

import com.f4.forum.entity.enums.BranchStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class BranchStatusChangedEvent extends ApplicationEvent {
    private final Long branchId;
    private final String branchName;
    private final BranchStatus oldStatus;
    private final BranchStatus newStatus;

    public BranchStatusChangedEvent(Object source, Long branchId, String branchName, BranchStatus oldStatus, BranchStatus newStatus) {
        super(source);
        this.branchId = branchId;
        this.branchName = branchName;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
}
