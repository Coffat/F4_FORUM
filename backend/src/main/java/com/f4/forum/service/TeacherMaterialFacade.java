package com.f4.forum.service;

import com.f4.forum.dto.request.CreateTeacherMaterialCommand;
import com.f4.forum.dto.response.TeacherMaterialResponse;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Material;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.MaterialRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherMaterialFacade {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;
    private final MaterialRepository materialRepository;

    public TeacherMaterialFacade(
            UserAccountRepository userAccountRepository,
            ClassRepository classRepository,
            MaterialRepository materialRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.classRepository = classRepository;
        this.materialRepository = materialRepository;
    }

    public List<TeacherMaterialResponse> getMaterials(Long classId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        return materialRepository.findByClassId(classId).stream()
                .map(m -> new TeacherMaterialResponse(
                        m.getId(),
                        m.getTitle(),
                        m.getDescription(),
                        m.getFileUrl(),
                        m.getUploadDate()
                ))
                .toList();
    }

    @Transactional
    public TeacherMaterialResponse createMaterial(
            Long classId,
            String token,
            CreateTeacherMaterialCommand command,
            String originalFileName
    ) {
        if (command.title() == null || command.title().isBlank()) {
            throw new RuntimeException("Tiêu đề tài liệu không được để trống!");
        }
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Vui lòng chọn file tài liệu để upload!");
        }

        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));

        Material saved = materialRepository.save(Material.builder()
                .classEntity(classEntity)
                .title(command.title().trim())
                .description(command.description() == null ? null : command.description().trim())
                .fileUrl("uploaded://" + originalFileName)
                .uploadDate(LocalDate.now())
                .build());

        return new TeacherMaterialResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getFileUrl(),
                saved.getUploadDate()
        );
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập module tài liệu!");
        }
        return account.getUser().getId();
    }

    private void validateTeacherOwnsClass(Long teacherId, Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));
        boolean isOwner = classEntity.getTeachers().stream().anyMatch(t -> t.getId().equals(teacherId));
        if (!isOwner) {
            throw new RuntimeException("Bạn không có quyền thao tác lớp học này!");
        }
    }
}

