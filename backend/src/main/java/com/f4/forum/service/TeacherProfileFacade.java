package com.f4.forum.service;

import com.f4.forum.dto.response.TeacherProfileResponse;
import com.f4.forum.entity.Teacher;
import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.repository.TeacherRepository;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Facade: Entry point cho Teacher Profile module.
 * Controller chỉ gọi Facade, không chứa logic nghiệp vụ.
 */
@Service
@Transactional(readOnly = true)
public class TeacherProfileFacade {

    private final UserAccountRepository userAccountRepository;
    private final TeacherRepository teacherRepository;

    public TeacherProfileFacade(UserAccountRepository userAccountRepository, TeacherRepository teacherRepository) {
        this.userAccountRepository = userAccountRepository;
        this.teacherRepository = teacherRepository;
    }

    public TeacherProfileResponse getMyProfile(String token) {
        String username = MockTokenUsernameExtractor.extractUsername(token);

        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new RuntimeException("Không có quyền truy cập hồ sơ giảng viên!");
        }

        Long userId = account.getUser().getId();
        Teacher teacher = teacherRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ giảng viên!"));

        return new TeacherProfileResponse(
                account.getUsername(),
                account.getRole().name(),
                teacher.getFullName(),
                teacher.getEmail(),
                teacher.getPhone(),
                teacher.getSpecialty(),
                teacher.getHireDate(),
                account.getLastLogin()
        );
    }
}

