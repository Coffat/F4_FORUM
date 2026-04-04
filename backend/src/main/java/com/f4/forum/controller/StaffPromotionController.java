package com.f4.forum.controller;

import com.f4.forum.dto.promotion.PromotionRequest;
import com.f4.forum.dto.promotion.PromotionResponse;
import com.f4.forum.facade.StaffPromotionFacade;
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
@RequestMapping("/api/v1/staff/promotions")
@RequiredArgsConstructor
@Tag(name = "Staff Promotion Management", description = "API cho Staff quản lý voucher khuyến mãi")
public class StaffPromotionController {

    private final StaffPromotionFacade staffPromotionFacade;

    @GetMapping
    @Operation(summary = "Lấy danh sách voucher", description = "Lấy danh sách tất cả voucher với phân trang")
    public ResponseEntity<Page<PromotionResponse>> getAllPromotions(Pageable pageable) {
        return ResponseEntity.ok(staffPromotionFacade.getAllPromotions(pageable));
    }

    @GetMapping("/valid")
    @Operation(summary = "Lấy danh sách voucher còn hiệu lực", description = "Lấy danh sách voucher còn hiệu lực để áp dụng")
    public ResponseEntity<List<PromotionResponse>> getValidPromotions() {
        return ResponseEntity.ok(staffPromotionFacade.getValidPromotions());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết voucher", description = "Lấy thông tin chi tiết của một voucher")
    public ResponseEntity<PromotionResponse> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(staffPromotionFacade.getPromotionById(id));
    }

    @PostMapping
    @Operation(summary = "Tạo voucher mới", description = "Tạo một voucher khuyến mãi mới")
    public ResponseEntity<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = staffPromotionFacade.createPromotion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật voucher", description = "Cập nhật thông tin voucher")
    public ResponseEntity<PromotionResponse> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = staffPromotionFacade.updatePromotion(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa voucher", description = "Xóa một voucher theo ID")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        staffPromotionFacade.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
