package com.f4.forum.controller;

import com.f4.forum.dto.request.CreateMaterialCommand;
import com.f4.forum.dto.request.UpdateMaterialCommand;
import com.f4.forum.dto.request.UpdateStaffCourseCommand;
import com.f4.forum.dto.response.CourseCatalogResponse;
import com.f4.forum.dto.response.CourseStatsResponse;
import com.f4.forum.dto.response.MaterialResponse;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.facade.StaffCourseFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/courses")
@RequiredArgsConstructor
@Tag(name = "Staff Courses Management", description = "Các API cho Staff quản lý khóa học và tài liệu (Course Materials)")
public class StaffCourseController {

    private final StaffCourseFacade staffCourseFacade;

    @GetMapping
    @Operation(summary = "Lấy danh sách khóa học cho Staff", description = "Lấy danh sách khóa học hỗ trợ phân trang và filter")
    public ResponseEntity<Page<CourseCatalogResponse>> getCourseCatalog(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(staffCourseFacade.getCourseCatalog(keyword, status, category, pageable));
    }

    @GetMapping("/stats")
    @Operation(summary = "Lấy thống kê khóa học cho Staff", description = "Lấy các thông số tổng quan phục vụ cho dashboard")
    public ResponseEntity<CourseStatsResponse> getCourseStats() {
        return ResponseEntity.ok(staffCourseFacade.getCourseStats());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật khóa học bởi Staff", description = "Staff cập nhật khóa học nhưng không được phép sửa Fee")
    public ResponseEntity<Void> updateCourseByStaff(@PathVariable Long id, @RequestBody @Valid UpdateStaffCourseCommand command) {
        staffCourseFacade.updateCourseByStaff(id, command);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}/materials")
    @Operation(summary = "Lấy danh sách tài liệu khóa học", description = "Lấy danh sách materials thuộc về courseId")
    public ResponseEntity<List<MaterialResponse>> getMaterials(@PathVariable Long courseId) {
        return ResponseEntity.ok(staffCourseFacade.getCourseMaterials(courseId));
    }

    @PostMapping("/{courseId}/materials")
    @Operation(summary = "Thêm tài liệu mới cho khóa học", description = "Tạo một material mới")
    public ResponseEntity<Long> createMaterial(@PathVariable Long courseId, @RequestBody @Valid CreateMaterialCommand command) {
        Long materialId = staffCourseFacade.createMaterial(courseId, command);
        return ResponseEntity.status(HttpStatus.CREATED).body(materialId);
    }

    @PutMapping("/materials/{id}")
    @Operation(summary = "Cập nhật tài liệu", description = "Cập nhật thông vị material hiện tại")
    public ResponseEntity<Void> updateMaterial(@PathVariable Long id, @RequestBody @Valid UpdateMaterialCommand command) {
        staffCourseFacade.updateMaterial(id, command);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/materials/{id}")
    @Operation(summary = "Xóa tài liệu", description = "Xóa vĩnh viễn material")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        staffCourseFacade.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
