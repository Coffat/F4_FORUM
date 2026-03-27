package com.f4.forum.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Để cho annotation @Async trong LoginEventListener hoạt động
}
