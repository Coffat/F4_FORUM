package com.f4.forum.entity;

import com.f4.forum.entity.enums.UserStatus;
import com.f4.forum.entity.enums.UserType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 50)
    private UserType userType;
    
    @Version
    private Long version;

    // Rich Domain Model: Các hành vi nghiệp vụ thay vì setter
    public void deactivateAccount() {
        this.status = UserStatus.INACTIVE;
    }

    public void updateContact(String phone, String email) {
        this.phone = phone;
        this.email = email;
    }

    public void updateBasicInfo(String fullName, UserStatus status) {
        this.fullName = fullName;
        this.status = status;
    }

    /**
     * Hành vi cập nhật dữ liệu cá nhân cho User.
     * Đảm bảo tính bao đóng và logic nghiệp vụ tập trung.
     */
    public void updatePersonalData(String phone, String avatarUrl, String email) {
        if (phone != null && !phone.isBlank()) {
            this.phone = phone;
        }
        if (email != null && !email.isBlank()) {
            this.email = email;
        }
        this.avatarUrl = avatarUrl;
    }
}
