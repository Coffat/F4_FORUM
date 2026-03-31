package com.f4.forum.service;

import com.f4.forum.dto.request.CreateMaterialCommand;
import com.f4.forum.dto.request.UpdateMaterialCommand;
import com.f4.forum.entity.Course;
import com.f4.forum.entity.Material;
import com.f4.forum.repository.CourseRepository;
import com.f4.forum.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterialCommandService {
    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;

    public Long createMaterial(Long courseId, CreateMaterialCommand command) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Material material = Material.builder()
                .course(course)
                .title(command.getTitle())
                .materialType(command.getMaterialType())
                .fileUrl(command.getFileUrl())
                .uploadDate(LocalDate.now())
                .build();

        return materialRepository.save(material).getId();
    }

    public void updateMaterial(Long id, UpdateMaterialCommand command) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        material.updateDetails(command.getTitle(), command.getMaterialType(), command.getFileUrl());
        materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        materialRepository.delete(material);
    }
}
