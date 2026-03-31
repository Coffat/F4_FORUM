package com.f4.forum.service;

import com.f4.forum.dto.response.MaterialResponse;
import com.f4.forum.entity.Material;
import com.f4.forum.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaterialQueryService {

    private final MaterialRepository materialRepository;

    public List<MaterialResponse> getMaterialsByCourseId(Long courseId) {
        List<Material> materials = materialRepository.findByCourseId(courseId);
        return materials.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MaterialResponse mapToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .courseId(material.getCourse() != null ? material.getCourse().getId() : null)
                .title(material.getTitle())
                .materialType(material.getMaterialType())
                .fileUrl(material.getFileUrl())
                .uploadDate(material.getUploadDate())
                .build();
    }
}
