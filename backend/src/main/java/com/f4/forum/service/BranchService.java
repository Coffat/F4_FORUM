package com.f4.forum.service;

import com.f4.forum.dto.BranchCommand;
import com.f4.forum.entity.Branch;
import com.f4.forum.entity.User;
import com.f4.forum.event.BranchStatusChangedEvent;
import com.f4.forum.repository.BranchRepository;
import com.f4.forum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public List<Branch> findAll() {
        return branchRepository.findAll();
    }

    @Transactional
    public Branch create(BranchCommand command) {
        Branch branch = Branch.builder()
                .name(command.name())
                .address(command.address())
                .phone(command.phone())
                .status(command.status())
                .capacity(command.capacity())
                .currentEnrollment(command.currentEnrollment())
                .build();

        if (command.managerId() != null) {
            User manager = userRepository.findById(command.managerId()).orElse(null);
            branch.assignManager(manager);
        }

        return branchRepository.save(branch);
    }

    @Transactional
    public Branch update(Long id, BranchCommand command) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Tell, Don't Ask: Sử dụng phương thức nghiệp vụ của Entity
        var oldStatus = branch.getStatus();
        branch.updateOperationalInfo(command.name(), command.address(), command.phone());
        branch.changeStatus(command.status());
        branch.updateCapacity(command.capacity());

        if (command.managerId() != null) {
            User manager = userRepository.findById(command.managerId()).orElse(null);
            branch.assignManager(manager);
        }

        Branch updated = branchRepository.save(branch);

        // Phát sự kiện (Observer Pattern) nếu trạng thái thay đổi
        if (oldStatus != command.status()) {
            eventPublisher.publishEvent(new BranchStatusChangedEvent(this, updated.getId(), updated.getName(), oldStatus, updated.getStatus()));
        }

        return updated;
    }

    @Transactional
    public void delete(Long id) {
        branchRepository.deleteById(id);
    }
}
