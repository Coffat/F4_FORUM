package com.f4.forum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class F4ForumApplication {

    public static void main(String[] args) {
        SpringApplication.run(F4ForumApplication.class, args);
    }

}
