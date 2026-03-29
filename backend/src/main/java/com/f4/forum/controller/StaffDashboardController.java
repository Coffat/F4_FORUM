package com.f4.forum.controller;

import com.f4.forum.dto.response.StaffDashboardMetricsResponse;
import com.f4.forum.service.StaffDashboardFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ===== FACADE PATTERN (Controller Layer) =====
 * Controller này mỏng, không chứa bất kỳ logic nghiệp vụ nào.
 * Nó chỉ nhận Request HTTP, ủy thác cho StaffDashboardFacade (Facade),
 * và trả về Response. Đây là nguyên tắc SRP (Single Responsibility Principle).
 *
 * Endpoint: GET /api/v1/staff-dashboard/metrics
 */
@RestController
@RequestMapping("/api/v1/staff-dashboard")
@RequiredArgsConstructor
@Tag(name = "Staff Dashboard", description = "APIs cung cấp dữ liệu tổng hợp cho trang Staff Operations Dashboard")
public class StaffDashboardController {

    // Dependency Injection qua Constructor (tuân thủ DIP - Dependency Inversion Principle)
    private final StaffDashboardFacade staffDashboardFacade;

    /**
     * API chính: Trả về toàn bộ metrics cho Staff Dashboard trong một lần gọi duy nhất.
     * Thiết kế này giảm thiểu số lần round-trip giữa Frontend và Backend.
     */
    @GetMapping("/metrics")
    @Operation(
            summary = "Lấy metrics tổng hợp cho Staff Dashboard",
            description = "Trả về một JSON object duy nhất bao gồm tất cả KPIs và dữ liệu widget " +
                          "cần thiết để render trang Staff Operations Dashboard. " +
                          "Sử dụng Facade Pattern để điều phối nhiều nguồn dữ liệu."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về toàn bộ dashboard metrics"),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống khi truy vấn database")
    })
    public ResponseEntity<StaffDashboardMetricsResponse> getDashboardMetrics() {
        // Ủy thác toàn bộ logic cho Facade - Controller không tự xử lý data
        return ResponseEntity.ok(staffDashboardFacade.computeDashboardMetrics());
    }
}
