package com.f4.forum.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println(">>> Custom SecurityConfig is active");
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()          // Auth (đăng nhập)
                .requestMatchers("/api/v1/courses/**").permitAll()        // Courses (công khai)
                .requestMatchers("/api/v1/branches/**").permitAll()       // Branches (công khai cho dev)
                .requestMatchers("/api/v1/teachers/**").permitAll()       // Teacher Portal (mock token)
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll() // Swagger
                .requestMatchers("/api/admin/**").permitAll()             // Admin functionalities (Until JWT Filter is set up)
                .requestMatchers("/api/v1/personnel/**").permitAll()      // Personnel module
                .requestMatchers("/api/v1/staff-dashboard/**").permitAll() // Staff Dashboard metrics
                .requestMatchers("/api/v1/staff/courses/**").permitAll()  // Staff Courses
                .requestMatchers("/api/v1/staff/classes/**").permitAll()  // Staff Classes
                .requestMatchers("/api/v1/staff/schedules/**").permitAll() // Staff Schedules
                .requestMatchers("/api/v1/staff/rooms/**").permitAll()     // Staff Rooms
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
