package com.f4.forum.controller;

import com.f4.forum.dto.request.CreateClassCommand;
import com.f4.forum.dto.request.UpdateClassCommand;
import com.f4.forum.dto.response.ClassCatalogResponse;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.service.ClassCommandService;
import com.f4.forum.service.ClassQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
@Tag(name = "Class Management", description = "Quản lý lớp học, cho phép Admin thao tác vòng đời của Class Entity")
public class ClassController {

    private final ClassQueryService classQueryService;
    private final ClassCommandService classCommandService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Lấy danh sách Lớp học", description = "Lấy danh sách phân trang kết hợp tìm kiếm theo Mã lớp và lọc theo Status. Cần quyền ADMIN hoặc STAFF.")
    public ResponseEntity<Page<ClassCatalogResponse>> getClasses(
            @RequestParam(required = false) String classCode,
            @RequestParam(required = false) ClassStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(classQueryService.getClasses(classCode, status, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo Lớp học mới", description = "Mở một lớp học mới từ Khóa học có sẵn. Đòi hỏi cấu hình Phòng học thỏa mãn sức chứa. Yêu cầu quyền ADMIN.")
    public ResponseEntity<Long> createClass(@RequestBody @Valid CreateClassCommand command) {
        Long classId = classCommandService.createClass(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(classId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cập nhật Lớp học", description = "Sửa thông tin lịch trình, đổi phòng học. Yêu cầu quyền ADMIN.")
    public ResponseEntity<Void> updateClass(
            @PathVariable Long id, 
            @RequestBody @Valid UpdateClassCommand command) {
        classCommandService.updateClass(id, command);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Hủy Lớp học", description = "Xóa mềm (chuyển status thành CANCELLED). Không được ủy quyền nếu đã có sinh viên học. Yêu cầu quyền ADMIN.")
    public ResponseEntity<Void> cancelClass(@PathVariable Long id) {
        classCommandService.cancelClass(id);
        return ResponseEntity.noContent().build();
    }
}
