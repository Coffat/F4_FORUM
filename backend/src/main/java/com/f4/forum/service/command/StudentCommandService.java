package com.f4.forum.service.command;

import com.f4.forum.dto.command.UpdateStudentProfileCommand;
import com.f4.forum.entity.Student;
import com.f4.forum.repository.StudentRepository;
import com.f4.forum.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * StudentCommandService - Chuyên trách các nghiệp vụ thay đổi (Write side).
 * Tuân thủ chuẩn SOLID và Transaction Management.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StudentCommandService {

    private final StudentRepository studentRepository;
    private final UserAccountRepository userAccountRepository;

    /**
     * Cập nhật hồ sơ học viên theo Username.
     * Áp dụng Rich Domain Model - Không dùng Setter trực tiếp.
     */
    public void updateProfileByUsername(String username, UpdateStudentProfileCommand command) {
        // 1. Phân giải danh tính (Anti-IDOR protection)
        var userAccount = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản: " + username));
        
        Long studentId = userAccount.getUser().getId();
        
        // 2. Gọi logic cập nhật lõi
        updateProfile(studentId, command);
    }

    /**
     * Cập nhật hồ sơ học viên theo ID.
     */
    public void updateProfile(Long studentId, UpdateStudentProfileCommand command) {
        // 1. Fetch Entity & Verify Existence
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Học viên không tồn tại ID: " + studentId));

        // 2. Áp dụng các thay đổi qua Domain Behaviors (Rich Domain Model)
        // Lưu ý: Ta chỉ cập nhật những thông tin cho phép học viên tự sửa.
        student.updateAccountProfile(
            student.getAddress(), 
            command.phoneNumber(),
            command.avatarUrl(),
            command.dateOfBirth(),
            command.email()
        );

        student.updateTargetScore(command.targetScore());

        log.info("Student profile updated successfully for ID: {}", studentId);
        
        // 3. Persistence: Spring Data JPA sẽ tự động flushing khi kết thúc Transaction
        studentRepository.save(student);
    }
}
