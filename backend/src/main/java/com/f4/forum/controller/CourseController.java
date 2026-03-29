package com.f4.forum.controller;

import com.f4.forum.dto.request.CreateCourseCommand;
import com.f4.forum.dto.response.CourseCatalogResponse;
import com.f4.forum.dto.response.CourseStatsResponse;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.service.CourseCommandService;
import com.f4.forum.service.CourseQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Các API quản lý và truy vấn khóa học IELTS / Tiếng Anh")
public class CourseController {

    private final CourseQueryService courseQueryService;
    private final CourseCommandService courseCommandService;

    @GetMapping
    @Operation(summary = "Lấy danh sách khóa học (phân trang)", description = "Sử dụng cho dashboard admin với filter bằng keyword, status, category")
    public ResponseEntity<Page<CourseCatalogResponse>> getCourseCatalog(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(courseQueryService.getCourseCatalog(keyword, status, category, pageable));
    }

    @GetMapping("/stats")
    @Operation(summary = "Lấy thống kê khóa học", description = "Lấy các thông số tổng quan phục vụ cho dashboard")
    public ResponseEntity<CourseStatsResponse> getCourseStats() {
        return ResponseEntity.ok(courseQueryService.getCourseStats());
    }

    @PostMapping
    @Operation(summary = "Tạo khóa học mới", description = "Lưu mới một course entity với Command pattern")
    public ResponseEntity<Long> createCourse(@RequestBody @Valid CreateCourseCommand command) {
        Long courseId = courseCommandService.createCourse(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết khóa học", description = "Lấy chi tiết dữ liệu 1 khóa học bằng ID")
    public ResponseEntity<CourseCatalogResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseQueryService.getCourseById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật khóa học", description = "Cập nhật khóa học với UpdateCourseCommand")
    public ResponseEntity<Void> updateCourse(@PathVariable Long id, @RequestBody @Valid com.f4.forum.dto.request.UpdateCourseCommand command) {
        courseCommandService.updateCourse(id, command);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa khóa học (Soft Delete)", description = "Lưu trữ khóa học bằng cách đổi trạng thái sang ARCHIVED")
    public ResponseEntity<Void> archiveCourse(@PathVariable Long id) {
        courseCommandService.archiveCourse(id);
        return ResponseEntity.noContent().build();
    }
}
