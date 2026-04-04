package com.f4.forum.validation.chain;

import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.exception.UnauthorizedException;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RoleValidator extends AbstractValidationHandler<TeacherContext> {
    private final UserAccountRepository userAccountRepository;
    private final String requiredRoleError;

    public RoleValidator(UserAccountRepository userAccountRepository) {
        this(userAccountRepository, "Không có quyền truy cập!");
    }

    @Override
    public void handle(TeacherContext context) {
        String username = MockTokenUsernameExtractor.extractUsername(context.getToken());
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Tài khoản không tồn tại!"));

        if (account.getRole() != AccountRole.ROLE_TEACHER && account.getRole() != AccountRole.ROLE_ADMIN) {
            throw new UnauthorizedException(requiredRoleError);
        }
        passToNext(context);
    }
}
