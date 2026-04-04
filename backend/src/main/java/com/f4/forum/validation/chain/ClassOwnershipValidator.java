package com.f4.forum.validation.chain;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.exception.ResourceNotFoundException;
import com.f4.forum.exception.UnauthorizedException;
import com.f4.forum.repository.ClassRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ClassOwnershipValidator extends AbstractValidationHandler<TeacherContext> {
    private final ClassRepository classRepository;

    @Override
    public void handle(TeacherContext context) {
        ClassEntity classEntity = classRepository.findById(context.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học!"));

        boolean ownsClass = classEntity.getTeachers().stream()
                .anyMatch(t -> t.getId().equals(context.getTeacherId()));

        if (!ownsClass) {
            throw new UnauthorizedException("Bạn không có quyền thao tác lớp học này!");
        }
        passToNext(context);
    }
}
