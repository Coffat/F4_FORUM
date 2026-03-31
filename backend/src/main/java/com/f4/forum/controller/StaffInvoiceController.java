package com.f4.forum.controller;

import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.facade.StaffInvoiceFacade;
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
@RequestMapping("/api/v1/staff/invoices")
@RequiredArgsConstructor
@Tag(name = "Staff Invoice Management", description = "API cho Staff quản lý hóa đơn (Invoice)")
public class StaffInvoiceController {

    private final StaffInvoiceFacade staffInvoiceFacade;

    @PostMapping
    @Operation(summary = "Tạo hóa đơn mới", description = "Staff tạo hóa đơn cho student với các chi tiết và khuyến mãi")
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceCommand command) {
        InvoiceResponse response = staffInvoiceFacade.createInvoice(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách hóa đơn", description = "Lấy danh sách hóa đơn với phân trang")
    public ResponseEntity<Page<InvoiceResponse>> getInvoices(Pageable pageable) {
        return ResponseEntity.ok(staffInvoiceFacade.getInvoices(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết hóa đơn", description = "Lấy thông tin chi tiết của một hóa đơn")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(staffInvoiceFacade.getInvoiceById(id));
    }

    @GetMapping("/students/search")
    @Operation(summary = "Tìm kiếm student", description = "Tìm kiếm student theo tên, email, hoặc SĐT")
    public ResponseEntity<List<InvoiceResponse.StudentInfo>> searchStudents(@RequestParam String keyword) {
        return ResponseEntity.ok(staffInvoiceFacade.searchStudents(keyword));
    }

    @GetMapping("/students/{studentId}/enrollments")
    @Operation(summary = "Lấy danh sách enrollment của student", description = "Lấy các lớp học student đang học")
    public ResponseEntity<List<InvoiceResponse.EnrollmentInfo>> getStudentEnrollments(@PathVariable Long studentId) {
        return ResponseEntity.ok(staffInvoiceFacade.getStudentEnrollments(studentId));
    }

    @GetMapping("/courses")
    @Operation(summary = "Lấy danh sách khóa học", description = "Lấy danh sách tất cả khóa học để tạo hóa đơn")
    public ResponseEntity<List<InvoiceResponse.CourseInfo>> getCourses() {
        return ResponseEntity.ok(staffInvoiceFacade.getAvailableCourses());
    }

    @GetMapping("/promotions")
    @Operation(summary = "Lấy danh sách voucher", description = "Lấy danh sách voucher/promotion còn hiệu lực")
    public ResponseEntity<List<InvoiceResponse.PromotionInfo>> getPromotions() {
        return ResponseEntity.ok(staffInvoiceFacade.getAvailablePromotions());
    }
}