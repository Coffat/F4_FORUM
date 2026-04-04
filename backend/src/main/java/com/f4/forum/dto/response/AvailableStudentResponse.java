package com.f4.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableStudentResponse {
    private Long id;
    private String studentCode;
    private String fullName;
    private String email;
}
