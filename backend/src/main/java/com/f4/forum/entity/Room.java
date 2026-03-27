package com.f4.forum.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder(toBuilder = true)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(nullable = false, length = 100)
    private String name;

    private Integer capacity;

    @Column(name = "room_type", length = 100)
    private String roomType;

    // Package-private, only used by Branch to maintain bidirectional relationship
    void assignToBranch(Branch branch) {
        this.branch = branch;
    }
    
    public boolean canAccommodate(int studentCount) {
        return capacity != null && capacity >= studentCount;
    }
}
