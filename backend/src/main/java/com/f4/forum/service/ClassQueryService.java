package com.f4.forum.service;

import com.f4.forum.dto.response.ClassCatalogResponse;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.enums.ClassStatus;
import com.f4.forum.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CQRS - Query Service: Chỉ chuyên xử lý Lấy và Hiển thị số liệu.
 * Đảm bảo (readOnly = true) để Spring tối ưu Hibernate Session, không quét dơ dữ liệu.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClassQueryService {

    private final ClassRepository classRepository;

    public Page<ClassCatalogResponse> getClasses(String classCode, ClassStatus status, Pageable pageable) {
        // Query tránh N+1
        Page<ClassEntity> entityPage = classRepository.findClassesWithFilters(classCode, status, pageable);
        
        // Ánh xạ sang Record Response
        return entityPage.map(c -> new ClassCatalogResponse(
                c.getId(),
                c.getClassCode(),
                c.getCourse() != null ? c.getCourse().getName() : null,
                c.getDefaultRoom() != null ? c.getDefaultRoom().getName() : "Chưa xếp phòng",
                c.getStartDate(),
                c.getEndDate(),
                c.getMaxStudents(),
                c.getCurrentEnrollment() != null ? c.getCurrentEnrollment() : 0,
                c.getStatus()
        ));
    }
}
