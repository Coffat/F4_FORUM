package com.f4.forum.security.event;

import org.springframework.context.ApplicationEvent;

/**
 * Observer Pattern: Định nghĩa Event (Sự kiện) được bắn ra khi đăng nhập thành công.
 */
public class LoginSuccessEvent extends ApplicationEvent {
    private final String username;

    public LoginSuccessEvent(Object source, String username) {
        super(source);
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
