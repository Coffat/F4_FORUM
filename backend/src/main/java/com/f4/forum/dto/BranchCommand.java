package com.f4.forum.dto;

import com.f4.forum.entity.enums.BranchStatus;
import lombok.Builder;

@Builder
public record BranchCommand(
    String name,
    String address,
    String phone,
    BranchStatus status,
    Integer capacity,
    Integer currentEnrollment,
    Long managerId
) {}
