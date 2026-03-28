package com.f4.forum.service;

import com.f4.forum.dto.request.CreateUserCommand;
import com.f4.forum.dto.request.UpdateUserCommand;
import com.f4.forum.entity.User;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.repository.UserRepository;
import com.f4.forum.service.factory.UserFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCommandService {
    
    private final UserRepository userRepository;
    private final UserAccountRepository userAccountRepository;
    private final UserFactory userFactory;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long executeCreateUser(CreateUserCommand command) {
        log.info("Executing CreateUserCommand for email: {}", command.email());
        
        // Factory Pattern: Tạo User đúng loại (Student/Teacher/Staff)
        User newUser = userFactory.createUser(command);
        userRepository.save(newUser);

        // Tạo Account để Login
        UserAccount account = UserAccount.builder()
            .user(newUser)
            .username(command.username())
            .passwordHash(passwordEncoder.encode(command.rawPassword()))
            .role(command.role())
            .build();
        userAccountRepository.save(account);

        return newUser.getId();
    }

    @Transactional
    public void executeUpdateUser(Long id, UpdateUserCommand command) {
        log.info("Executing UpdateUserCommand for user id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        // Rich Domain Model: Cập nhật qua setter an toàn
        user.updateBasicInfo(command.fullName(), command.status());
        user.updateContact(command.phone(), command.email());
        
        userRepository.save(user);
    }

    @Transactional
    public void executeDeleteUser(Long id) {
        log.info("Executing Delete User for id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        
        // Because UserAccount has cascade/delete, deleting user will delete the account appropriately.
        userRepository.delete(user);
    }
}
