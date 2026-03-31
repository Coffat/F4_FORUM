package com.f4.forum.service;

import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.exception.ResourceNotFoundException;
import com.f4.forum.exception.UnauthorizedException;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeacherContextResolver {

    private final UserAccountRepository userAccountRepository;
    private final ClassRepository classRepository;

    public Long resolveTeacherIdFromToken(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new UnauthorizedException("Không có quyền truy cập!");
        }
        return account.getUser().getId();
    }

    public void validateTeacherOwnsClass(Long teacherId, Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học!"));

        boolean ownsClass = classEntity.getTeachers().stream()
                .anyMatch(t -> t.getId().equals(teacherId));

        if (!ownsClass) {
            throw new UnauthorizedException("Bạn không có quyền thao tác lớp học này!");
        }
    }
}
