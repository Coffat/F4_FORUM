package com.f4.forum.controller;

import com.f4.forum.dto.CourseDTO;
import com.f4.forum.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@Tag(name = "Courses", description = "Các API quản lý và truy vấn khóa học IELTS / Tiếng Anh")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ─── GET /api/v1/courses ─────────────────────────────────────────────────
    @Operation(
        summary = "Lấy danh sách toàn bộ khóa học",
        description = "Trả về toàn bộ danh sách khóa học hiện có, có thể lọc theo `level` hoặc `keyword`."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Danh sách khóa học",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CourseDTO.class))))
    })
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(
        @Parameter(description = "Lọc theo cấp độ (STARTER / ELEMENTARY / PRE-INTERMEDIATE / INTERMEDIATE / UPPER-INTERMEDIATE / ADVANCED / HIGH-ADVANCED / EXPERT)")
        @RequestParam(required = false) String level,

        @Parameter(description = "Tìm kiếm theo tên khóa học")
        @RequestParam(required = false) String keyword
    ) {
        if (level != null && !level.isBlank()) {
            return ResponseEntity.ok(courseService.filterByLevel(level));
        }
        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(courseService.searchByName(keyword));
        }
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // ─── GET /api/v1/courses/{id} ─────────────────────────────────────────────
    @Operation(
        summary = "Lấy chi tiết 1 khóa học theo ID",
        description = "Trả về đầy đủ thông tin của một khóa học, bao gồm mô tả và học phí."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chi tiết khóa học",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = CourseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Không tìm thấy khóa học",
            content = @Content(mediaType = "text/plain"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(
        @Parameter(description = "ID của khóa học", example = "1", required = true)
        @PathVariable Long id
    ) {
        try {
            return ResponseEntity.ok(courseService.getCourseById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
