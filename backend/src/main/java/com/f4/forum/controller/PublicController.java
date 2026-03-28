package com.f4.forum.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "Public Information", description = "Các API công khai cung cấp thông tin về trung tâm và dịch vụ")
public class PublicController {

    @Operation(summary = "Lấy thông tin giới thiệu về F4 Forum (About Us)", 
               description = "Trả về metadata và các thông tin cơ bản về tầm nhìn, sứ mệnh của trung tâm.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thông tin giới thiệu",
            content = @Content(mediaType = "application/json",
                schema = @Schema(example = "{\"title\": \"The F4 Philosophy\", \"tagline\": \"Fast, Focus, Future, Foundation.\"}")))
    })
    @GetMapping("/about-us")
    public ResponseEntity<Map<String, String>> getAboutInfo() {
        return ResponseEntity.ok(Map.of(
            "title", "The F4 Philosophy",
            "tagline", "Fast, Focus, Future, Foundation.",
            "description", "Redefining the architecture of English language mastery through curated rigor and intentional depth.",
            "version", "1.0.0"
        ));
    }
}
