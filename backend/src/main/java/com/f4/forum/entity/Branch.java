package com.f4.forum.entity;

import com.f4.forum.entity.enums.BranchStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "branches")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BranchStatus status;

    private Integer capacity;

    @Column(name = "current_enrollment")
    private Integer currentEnrollment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Version
    private Long version;

    @Builder.Default
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    // --- Rich Domain Model: Business Behaviors ---

    public void updateOperationalInfo(String name, String address, String phone) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Branch name cannot be empty");
        this.name = name;
        this.address = address;
        this.phone = phone;
    }

    public void changeStatus(BranchStatus newStatus) {
        this.status = newStatus;
    }

    public void updateCapacity(Integer newCapacity) {
        if (newCapacity != null && newCapacity < this.currentEnrollment) {
            throw new IllegalStateException("New capacity cannot be less than current enrollment");
        }
        this.capacity = newCapacity;
    }

    public void assignManager(User manager) {
        this.manager = manager;
    }

    public void incrementEnrollment() {
        if (this.currentEnrollment >= this.capacity) {
            throw new IllegalStateException("Branch is at full capacity");
        }
        this.currentEnrollment++;
    }

    // Existing relationship management
    public void addRoom(Room room) {
        rooms.add(room);
        room.assignToBranch(this);
    }

    public void removeRoom(Room room) {
        rooms.remove(room);
        room.assignToBranch(null);
    }
}
