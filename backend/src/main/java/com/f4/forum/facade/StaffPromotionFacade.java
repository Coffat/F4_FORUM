package com.f4.forum.facade;

import com.f4.forum.dto.promotion.PromotionRequest;
import com.f4.forum.dto.promotion.PromotionResponse;
import com.f4.forum.entity.Promotion;
import com.f4.forum.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ===== FACADE PATTERN =====
 * Điểm truy cập duy nhất cho module Staff Promotion Management.
 * Che giấu sự phức tạp của việc CRUD Promotion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StaffPromotionFacade {

    private final PromotionRepository promotionRepository;

    /**
     * Lấy danh sách tất cả promotions với phân trang.
     */
    @Transactional(readOnly = true)
    public Page<PromotionResponse> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable).map(this::mapToResponse);
    }

    /**
     * Lấy danh sách promotions còn hiệu lực.
     */
    @Transactional(readOnly = true)
    public List<PromotionResponse> getValidPromotions() {
        return promotionRepository.findValidPromotions().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết promotion theo ID.
     */
    @Transactional(readOnly = true)
    public PromotionResponse getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found: " + id));
        return mapToResponse(promotion);
    }

    /**
     * Tạo promotion mới.
     */
    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        // Validate promo code unique
        if (promotionRepository.findAll().stream()
                .anyMatch(p -> p.getPromoCode().equalsIgnoreCase(request.getCode()))) {
            throw new IllegalArgumentException("Mã voucher đã tồn tại: " + request.getCode());
        }

        Promotion.DiscountType discountType = Promotion.DiscountType.valueOf(request.getDiscountType());
        
        Promotion promotion = Promotion.builder()
                .promoCode(request.getCode().toUpperCase())
                .discountType(discountType)
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .endDate(request.getEndDate())
                .build();

        Promotion saved = promotionRepository.save(promotion);
        log.info("Created promotion: {} with {} {} discount", 
                saved.getPromoCode(), saved.getDiscountValue(), 
                saved.getDiscountType() == Promotion.DiscountType.PERCENT ? "%" : "VNĐ");
        
        return mapToResponse(saved);
    }

    /**
     * Cập nhật promotion.
     */
    @Transactional
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found: " + id));

        // Validate promo code unique (trừ chính nó)
        if (promotionRepository.findAll().stream()
                .anyMatch(p -> p.getPromoCode().equalsIgnoreCase(request.getCode()) && !p.getId().equals(id))) {
            throw new IllegalArgumentException("Mã voucher đã tồn tại: " + request.getCode());
        }

        Promotion.DiscountType discountType = Promotion.DiscountType.valueOf(request.getDiscountType());
        
        promotion = Promotion.builder()
                .id(promotion.getId())
                .promoCode(request.getCode().toUpperCase())
                .discountType(discountType)
                .discountValue(request.getDiscountValue())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .endDate(request.getEndDate())
                .build();

        Promotion saved = promotionRepository.save(promotion);
        log.info("Updated promotion: {} with ID: {}", saved.getPromoCode(), saved.getId());
        
        return mapToResponse(saved);
    }

    /**
     * Xóa promotion.
     */
    @Transactional
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new IllegalArgumentException("Promotion not found: " + id);
        }
        promotionRepository.deleteById(id);
        log.info("Deleted promotion with ID: {}", id);
    }

    /**
     * Map entity to response DTO.
     */
    private PromotionResponse mapToResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .code(promotion.getPromoCode())
                .name(promotion.getPromoCode())
                .discountType(promotion.getDiscountType() != null ? promotion.getDiscountType().name() : null)
                .discountValue(promotion.getDiscountValue())
                .maxDiscountAmount(promotion.getMaxDiscountAmount())
                .endDate(promotion.getEndDate())
                .valid(promotion.isValid())
                .build();
    }
}
