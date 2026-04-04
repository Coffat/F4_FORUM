package com.f4.forum.config;

import com.f4.forum.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Senior Backend Architecture - Security Configuration.
 * Tích hợp Filter giải mã JWT và quản lý phân quyền Endpoint.
 */
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity // Kích hoạt @PreAuthorize("hasRole(...)")
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

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
        System.out.println(">>> Security Architecture: ACTIVE with JWT Filter");
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/student/**").hasRole("STUDENT") 
                .requestMatchers("/api/v1/courses/**").permitAll()
                .requestMatchers("/api/v1/teachers/**").permitAll()
                .requestMatchers("/api/v1/branches/**").permitAll()
                .requestMatchers("/api/v1/rooms/**").permitAll()
                .requestMatchers("/api/v1/classes/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/admin/**").permitAll()
                .requestMatchers("/api/v1/personnel/**").permitAll()
                .requestMatchers("/api/v1/staff-dashboard/**").permitAll()
                .requestMatchers("/api/v1/staff/courses/**").permitAll()
                .requestMatchers("/api/v1/staff/classes/**").permitAll()
                .requestMatchers("/api/v1/staff/schedules/**").permitAll()
                .requestMatchers("/api/v1/staff/rooms/**").permitAll()
                .requestMatchers("/api/v1/staff/invoices/**").permitAll()
                .requestMatchers("/api/v1/staff/promotions/**").permitAll()
                .anyRequest().authenticated()
            )
            // Kích hoạt JWT Filter trước các Filter mặc định của Spring
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
