package com.f4.forum.event.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserCreatedEvent {
    private final Long userId;
    private final String username;
    private final String role;
}
