package com.f4.forum.validation.chain;

import com.f4.forum.entity.UserAccount;
import com.f4.forum.entity.enums.AccountRole;
import com.f4.forum.exception.UnauthorizedException;
import com.f4.forum.repository.UserAccountRepository;
import com.f4.forum.security.util.MockTokenUsernameExtractor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TokenValidator extends AbstractValidationHandler<TeacherContext> {
    private final UserAccountRepository userAccountRepository;

    @Override
    public void handle(TeacherContext context) {
        String username = MockTokenUsernameExtractor.extractUsername(context.getToken());
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Tài khoản không tồn tại!"));

        context.setTeacherId(account.getUser().getId());
        passToNext(context);
    }
}
