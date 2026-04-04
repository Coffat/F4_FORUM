package com.f4.forum.facade;

import com.f4.forum.dto.invoice.CreateInvoiceCommand;
import com.f4.forum.dto.invoice.InvoiceResponse;
import com.f4.forum.entity.*;
import com.f4.forum.entity.enums.InvoiceStatus;
import com.f4.forum.event.invoice.InvoiceCreatedEvent;
import com.f4.forum.event.invoice.InvoicePaidEvent;
import com.f4.forum.repository.*;
import com.f4.forum.state.invoice.InvoiceStateContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ===== FACADE PATTERN =====
 * Điểm truy cập duy nhất cho module Staff Invoice Management.
 * Che giấu sự phức tạp của việc phối hợp Invoice, Enrollment, Promotion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StaffInvoiceFacade {

    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PromotionRepository promotionRepository;
    private final CourseRepository courseRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final InvoiceStateContext invoiceStateContext;

    /**
     * Tạo hóa đơn mới cho student.
     * Sử dụng Builder pattern và Rich Domain Model.
     */
    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceCommand command) {
        log.info("Creating invoice for student ID: {}", command.getStudentId());

        // 1. Validate student tồn tại
        Student student = studentRepository.findById(command.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + command.getStudentId()));

        // 2. Tạo Invoice sử dụng Builder pattern
        Invoice invoice = Invoice.builder()
                .student(student)
                .status(InvoiceStatus.PENDING)
                .dueDate(command.getDueDate())
                .build();

        // 3. Thêm chi tiết hóa đơn (sử dụng Rich Domain Model)
        if (command.getDetails() != null) {
            for (CreateInvoiceCommand.InvoiceDetailItem detailItem : command.getDetails()) {
                // Validate course tồn tại
                Course course = courseRepository.findById(detailItem.getCourseId())
                        .orElseThrow(() -> new IllegalArgumentException("Course not found: " + detailItem.getCourseId()));

                // Tạo InvoiceDetail
                InvoiceDetail detail = InvoiceDetail.builder()
                        .course(course)
                        .description(detailItem.getDescription())
                        .unitPrice(detailItem.getUnitPrice())
                        .discountAmount(detailItem.getDiscountAmount() != null ? detailItem.getDiscountAmount() : java.math.BigDecimal.ZERO)
                        .build();

                invoice.addDetail(detail);
            }
        }

        // 4. Áp dụng promotions (sử dụng Rich Domain Model)
        if (command.getPromotionIds() != null && !command.getPromotionIds().isEmpty()) {
            List<Promotion> promotions = promotionRepository.findByIdIn(command.getPromotionIds());
            for (Promotion promotion : promotions) {
                invoice.applyPromotion(promotion);
            }
        }

        // 5. Tính toán tổng sau khi thêm tất cả details và promotions
        invoice.recalculateAll();

        // 6. Lưu vào DB
        Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);
        log.info("Invoice created with ID: {}, base: {}, final: {}", 
                savedInvoice.getId(), savedInvoice.getBaseAmount(), savedInvoice.getFinalAmount());

        // 7. Publish event sau khi transaction thành công
        eventPublisher.publishEvent(new InvoiceCreatedEvent(
                savedInvoice.getId(),
                "INV-" + String.format("%06d", savedInvoice.getId()),
                savedInvoice.getStudent().getId(),
                savedInvoice.getStudent().getFullName(),
                savedInvoice.getStudent().getEmail(),
                savedInvoice.getFinalAmount(),
                savedInvoice.getDueDate()
        ));

        // 8. Map to response
        return mapToResponse(savedInvoice);
    }

    /**
     * Lấy danh sách hóa đơn với phân trang.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(this::mapToResponse);
    }

    /**
     * Lấy chi tiết hóa đơn theo ID.
     */
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));
        return mapToResponse(invoice);
    }

    /**
     * Tìm kiếm student theo keyword.
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse.StudentInfo> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword).stream()
                .map(s -> InvoiceResponse.StudentInfo.builder()
                        .id(s.getId())
                        .fullName(s.getFullName())
                        .email(s.getEmail())
                        .phone(s.getPhone())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách enrollment của student.
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse.EnrollmentInfo> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, com.f4.forum.entity.enums.EnrollmentStatus.ENROLLED)
                .stream()
                .map(e -> InvoiceResponse.EnrollmentInfo.builder()
                        .id(e.getId())
                        .classId(e.getClassEntity().getId())
                        .classCode(e.getClassEntity().getClassCode())
                        .courseName(e.getClassEntity().getCourse() != null ? e.getClassEntity().getCourse().getName() : "Unknown")
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách khóa học available để tạo hóa đơn (không cần enrollment).
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse.CourseInfo> getAvailableCourses() {
        return courseRepository.findAll().stream()
                .map(c -> InvoiceResponse.CourseInfo.builder()
                        .id(c.getId())
                        .code(c.getCode())
                        .name(c.getName())
                        .fee(c.getFee())
                        .level(c.getLevel())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách voucher/promotion có thể sử dụng.
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse.PromotionInfo> getAvailablePromotions() {
        return promotionRepository.findValidPromotions().stream()
                .map(p -> InvoiceResponse.PromotionInfo.builder()
                        .id(p.getId())
                        .code(p.getPromoCode())
                        .name(p.getPromoCode())
                        .discountType(p.getDiscountType() != null ? p.getDiscountType().name() : null)
                        .discountValue(p.getDiscountValue())
                        .maxDiscountAmount(p.getMaxDiscountAmount())
                        .endDate(p.getEndDate())
                        .valid(p.isValid())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Thanh toán hóa đơn sử dụng State Pattern.
     * Publish InvoicePaidEvent sau khi thanh toán thành công.
     */
    @Transactional
    public InvoiceResponse payInvoice(Long invoiceId, BigDecimal amount) {
        log.info("Processing payment for invoice ID: {}, amount: {}", invoiceId, amount);
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
        
        // Sử dụng State Pattern để xử lý thanh toán
        if (!invoiceStateContext.canPay(invoice)) {
            throw new IllegalStateException("Cannot pay invoice in current state: " + invoice.getStatus());
        }
        
        invoiceStateContext.pay(invoice, amount);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        // Publish event cho notification
        eventPublisher.publishEvent(new InvoicePaidEvent(
                savedInvoice.getId(),
                "INV-" + String.format("%06d", savedInvoice.getId()),
                savedInvoice.getStudent().getId(),
                savedInvoice.getStudent().getFullName(),
                amount
        ));
        
        log.info("Invoice {} paid successfully via State Pattern", invoiceId);
        return mapToResponse(savedInvoice);
    }

    /**
     * Hủy hóa đơn sử dụng State Pattern.
     */
    @Transactional
    public InvoiceResponse cancelInvoice(Long invoiceId) {
        log.info("Cancelling invoice ID: {}", invoiceId);
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));
        
        if (!invoiceStateContext.canCancel(invoice)) {
            throw new IllegalStateException("Cannot cancel invoice in current state: " + invoice.getStatus());
        }
        
        invoiceStateContext.cancel(invoice);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        log.info("Invoice {} cancelled successfully via State Pattern", invoiceId);
        return mapToResponse(savedInvoice);
    }

    /**
     * Map entity to response DTO.
     */
    private InvoiceResponse mapToResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceCode("INV-" + String.format("%06d", invoice.getId()))
                .student(InvoiceResponse.StudentInfo.builder()
                        .id(invoice.getStudent().getId())
                        .fullName(invoice.getStudent().getFullName())
                        .email(invoice.getStudent().getEmail())
                        .phone(invoice.getStudent().getPhone())
                        .build())
                .baseAmount(invoice.getBaseAmount())
                .finalAmount(invoice.getFinalAmount())
                .status(invoice.getStatus())
                .dueDate(invoice.getDueDate())
                .details(invoice.getDetails().stream()
                        .map(d -> InvoiceResponse.InvoiceDetailResponse.builder()
                                .id(d.getId())
                                .courseId(d.getCourse() != null ? d.getCourse().getId() : null)
                                .courseName(d.getCourse() != null ? d.getCourse().getName() : d.getDescription())
                                .description(d.getDescription())
                                .unitPrice(d.getUnitPrice())
                                .discountAmount(d.getDiscountAmount())
                                .finalPrice(d.getFinalPrice())
                                .build())
                        .collect(Collectors.toList()))
                .promotions(invoice.getPromotions().stream()
                        .map(p -> InvoiceResponse.PromotionInfo.builder()
                                .id(p.getId())
                                .code(p.getPromoCode())
                                .name(p.getPromoCode())
                                .discountType(p.getDiscountType() != null ? p.getDiscountType().name() : null)
                                .discountValue(p.getDiscountValue())
                                .maxDiscountAmount(p.getMaxDiscountAmount())
                                .endDate(p.getEndDate())
                                .valid(p.isValid())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .build();
    }
}