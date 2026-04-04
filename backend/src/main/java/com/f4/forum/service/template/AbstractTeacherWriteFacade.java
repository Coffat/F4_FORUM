package com.f4.forum.service.template;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Teacher;
import com.f4.forum.exception.ResourceNotFoundException;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.TeacherRepository;
import com.f4.forum.service.TeacherContextResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Supplier;

@RequiredArgsConstructor
public abstract class AbstractTeacherWriteFacade {

    protected final TeacherContextResolver teacherContextResolver;
    protected final ClassRepository classRepository;
    protected final TeacherRepository teacherRepository;

    @Transactional
    protected <R> R executeWrite(Long classId, String token, Supplier<R> commandExecutor) {
        Long teacherId = teacherContextResolver.resolveTeacherIdFromToken(token);
        validateOwnership(teacherId, classId);
        preValidate(classId, token);
        R result = doExecute(classId, teacherId, commandExecutor);
        postExecute(result);
        return result;
    }

    @Transactional
    protected <R> R executeWriteWithResult(Long classId, String token, Supplier<R> commandExecutor, java.util.function.Consumer<R> eventPublisher) {
        Long teacherId = teacherContextResolver.resolveTeacherIdFromToken(token);
        validateOwnership(teacherId, classId);
        preValidate(classId, token);
        R result = doExecute(classId, teacherId, commandExecutor);
        postExecute(result);
        if (eventPublisher != null) {
            eventPublisher.accept(result);
        }
        return result;
    }

    protected void validateOwnership(Long teacherId, Long classId) {
        teacherContextResolver.validateTeacherOwnsClass(teacherId, classId);
    }

    protected void preValidate(Long classId, String token) {
    }

    protected <R> R doExecute(Long classId, Long teacherId, Supplier<R> commandExecutor) {
        return commandExecutor.get();
    }

    protected void postExecute(Object result) {
    }

    protected ClassEntity getClassEntity(Long classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học!"));
    }

    protected Teacher getTeacher(Long teacherId) {
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ giảng viên!"));
    }
}
