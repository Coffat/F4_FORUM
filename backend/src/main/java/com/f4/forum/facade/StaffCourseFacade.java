package com.f4.forum.facade;

import com.f4.forum.dto.request.CreateMaterialCommand;
import com.f4.forum.dto.request.UpdateMaterialCommand;
import com.f4.forum.dto.request.UpdateStaffCourseCommand;
import com.f4.forum.dto.response.CourseCatalogResponse;
import com.f4.forum.dto.response.CourseStatsResponse;
import com.f4.forum.dto.response.MaterialResponse;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.service.CourseCommandService;
import com.f4.forum.service.CourseQueryService;
import com.f4.forum.service.MaterialCommandService;
import com.f4.forum.service.MaterialQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Điểm chạm duy nhất (Facade Pattern) điều phối các tác vụ liên quan đến Staff Course.
 * Thay vì để Controller gọi trực tiếp quá nhiều Service, Facade giúp ẩn đi 
 * sự phức tạp của hệ thống và tuân thủ nguyên tắc Single Responsibility.
 */
@Service
@RequiredArgsConstructor
public class StaffCourseFacade {

    private final CourseCommandService courseCommandService;
    private final CourseQueryService courseQueryService;
    private final MaterialCommandService materialCommandService;
    private final MaterialQueryService materialQueryService;

    // --- Course Orchestration ---
    public Page<CourseCatalogResponse> getCourseCatalog(String keyword, CourseStatus status, String category, Pageable pageable) {
        return courseQueryService.getCourseCatalog(keyword, status, category, pageable);
    }

    public CourseStatsResponse getCourseStats() {
        return courseQueryService.getCourseStats();
    }

    public void updateCourseByStaff(Long id, UpdateStaffCourseCommand command) {
        courseCommandService.updateCourseByStaff(id, command);
    }

    // --- Material Orchestration ---
    public List<MaterialResponse> getCourseMaterials(Long courseId) {
        return materialQueryService.getMaterialsByCourseId(courseId);
    }

    public Long createMaterial(Long courseId, CreateMaterialCommand command) {
        return materialCommandService.createMaterial(courseId, command);
    }

    public void updateMaterial(Long id, UpdateMaterialCommand command) {
        materialCommandService.updateMaterial(id, command);
    }

    public void deleteMaterial(Long id) {
        materialCommandService.deleteMaterial(id);
    }
}
