package com.f4.forum.security.event;

import com.f4.forum.entity.UserAccount;
import com.f4.forum.repository.UserAccountRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Observer Pattern: Các Listener (chờ đợi) lắng nghe sự kiện LoginSuccessEvent để thực thi tác vụ nền.
 */
@Component
public class LoginEventListener {

    private final UserAccountRepository userAccountRepository;

    public LoginEventListener(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @EventListener
    @Async // Thực thi bất đồng bộ để không chặn Request chính
    @Transactional
    public void handleLoginSuccess(LoginSuccessEvent event) {
        // Hậu xử lý (Side-effect): Cập nhật thời gian đăng nhập cuối cùng
        userAccountRepository.findByUsername(event.getUsername()).ifPresent(account -> {
            account.recordLogin();
            userAccountRepository.save(account);
            System.out.println("Observer -> Đã cập nhật LastLogin cho user: " + event.getUsername());
        });
    }
}
