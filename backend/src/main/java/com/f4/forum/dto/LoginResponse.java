package com.f4.forum.dto;
public record LoginResponse(String token, String username, String role, String fullName) {}
