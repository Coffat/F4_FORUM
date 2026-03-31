package com.f4.forum.service;

import com.f4.forum.dto.request.CreateTeacherAssignmentCommand;
import com.f4.forum.dto.request.UpdateTeacherAssignmentCommand;
import com.f4.forum.dto.response.TeacherAssignmentResponse;
import com.f4.forum.entity.Assignment;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Teacher;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.repository.AssignmentRepository;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.TeacherRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Facade module Assignment của Teacher Portal.
 */
@Service
@Transactional(readOnly = true)
public class TeacherAssignmentFacade {

    private final UserAccountRepository userAccountRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;
    private final AssignmentRepository assignmentRepository;

    public TeacherAssignmentFacade(
            UserAccountRepository userAccountRepository,
            TeacherRepository teacherRepository,
            ClassRepository classRepository,
            AssignmentRepository assignmentRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.teacherRepository = teacherRepository;
        this.classRepository = classRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<TeacherAssignmentResponse> getAssignments(Long classId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        return assignmentRepository.findByClassIdAndTeacherId(classId, teacherId).stream()
                .map(a -> new TeacherAssignmentResponse(
                        a.getId(),
                        a.getTitle(),
                        a.getDescription(),
                        a.getAttachmentUrl(),
                        a.getDueDate()
                ))
                .toList();
    }

    @Transactional
    public TeacherAssignmentResponse createAssignment(
            Long classId,
            String token,
            CreateTeacherAssignmentCommand command,
            String originalFileName
    ) {
        if (command.title() == null || command.title().isBlank()) {
            throw new RuntimeException("Tiêu đề bài tập không được để trống!");
        }

        if (command.description() == null || command.description().isBlank()) {
            throw new RuntimeException("Mô tả bài tập không được để trống!");
        }

        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giảng viên!"));
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));

        BigDecimal maxScore = command.maxScore() == null ? BigDecimal.valueOf(100) : command.maxScore();
        if (maxScore.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Điểm tối đa phải lớn hơn 0!");
        }

        LocalDateTime dueDate = command.dueDateTime() == null ? LocalDateTime.now().plusDays(7) : command.dueDateTime();

        String attachmentUrl = (originalFileName == null || originalFileName.isBlank())
                ? null
                : "uploaded://" + originalFileName;

        Assignment assignment = Assignment.builder()
                .classEntity(classEntity)
                .teacher(teacher)
                .title(command.title().trim())
                .description(command.description().trim())
                .attachmentUrl(attachmentUrl)
                .dueDate(dueDate)
                .maxScore(maxScore)
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        return new TeacherAssignmentResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getAttachmentUrl(),
                saved.getDueDate()
        );
    }

    @Transactional
    public TeacherAssignmentResponse updateAssignment(
            Long classId,
            Long assignmentId,
            String token,
            UpdateTeacherAssignmentCommand command,
            String originalFileName
    ) {
        if (command.title() == null || command.title().isBlank()) {
            throw new RuntimeException("Tiêu đề bài tập không được để trống!");
        }
        if (command.description() == null || command.description().isBlank()) {
            throw new RuntimeException("Mô tả bài tập không được để trống!");
        }

        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);

        Assignment assignment = assignmentRepository
                .findOwnedAssignment(assignmentId, classId, teacherId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập hoặc bạn không có quyền thao tác!"));

        BigDecimal maxScore = command.maxScore() == null ? assignment.getMaxScore() : command.maxScore();
        if (maxScore != null && maxScore.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Điểm tối đa phải lớn hơn 0!");
        }

        LocalDateTime dueDate = command.dueDateTime() == null ? assignment.getDueDate() : command.dueDateTime();

        String attachmentUrl;
        if (originalFileName == null || originalFileName.isBlank()) {
            attachmentUrl = assignment.getAttachmentUrl();
        } else {
            attachmentUrl = "uploaded://" + originalFileName;
        }

        assignment.updateBasics(
                command.title(),
                command.description(),
                dueDate,
                maxScore,
                attachmentUrl
        );

        return new TeacherAssignmentResponse(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getAttachmentUrl(),
                assignment.getDueDate()
        );
    }

    @Transactional
    public void deleteAssignment(Long classId, Long assignmentId, String token) {
        Long teacherId = resolveTeacherIdFromToken(token);
        validateTeacherOwnsClass(teacherId, classId);
        Assignment assignment = assignmentRepository
                .findOwnedAssignment(assignmentId, classId, teacherId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập hoặc bạn không có quyền thao tác!"));
        assignmentRepository.delete(assignment);
    }

    private Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập module bài tập!");
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

