package com.f4.forum.controller;

import com.f4.forum.dto.BranchCommand;
import com.f4.forum.entity.Branch;
import com.f4.forum.service.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
@Tag(name = "Branch Management", description = "API cho việc quản lý các chi nhánh (Campus) của trung tâm")
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả chi nhánh", description = "Trả về toàn bộ thông tin chi nhánh bao gồm quản lý và sức chứa.")
    public List<Branch> getAllBranches() {
        return branchService.findAll();
    }

    @PostMapping
    @Operation(summary = "Tạo chi nhánh mới", description = "Khởi tạo một chi nhánh mới dựa trên Command object.")
    @ApiResponse(responseCode = "200", description = "Tạo thành công", 
                 content = @Content(schema = @Schema(implementation = Branch.class)))
    public Branch createBranch(@RequestBody BranchCommand command) {
        return branchService.create(command);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật chi nhánh", description = "Cập nhật thông tin vận hành và trạng thái của chi nhánh. Có thể kích hoạt sự kiện thay đổi trạng thái.")
    public Branch updateBranch(@PathVariable Long id, @RequestBody BranchCommand command) {
        return branchService.update(id, command);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa chi nhánh", description = "Xóa hoàn toàn chi nhánh khỏi hệ thống.")
    public void deleteBranch(@PathVariable Long id) {
        branchService.delete(id);
    }
}
