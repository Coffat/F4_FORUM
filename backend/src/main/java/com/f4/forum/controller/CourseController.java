package com.f4.forum.controller;

import com.f4.forum.dto.CourseDTO;
import com.f4.forum.security.facade.CourseFacade;
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

    private final CourseFacade courseFacade;

    public CourseController(CourseFacade courseFacade) {
        this.courseFacade = courseFacade;
    }

    @Operation(summary = "Lấy danh sách toàn bộ khóa học", 
               description = "Sử dụng Facade để điều phối logic filtering và searching.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Danh sách khóa học",
            content = @Content(mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CourseDTO.class))))
    })
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(
        @RequestParam(required = false) String level,
        @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(courseFacade.getAllCourses(level, keyword));
    }

    @Operation(summary = "Lấy chi tiết 1 khóa học theo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Chi tiết khóa học",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = CourseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Không tìm thấy khóa học",
            content = @Content(mediaType = "text/plain"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(courseFacade.getCourseById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
