package com.f4.forum.service;

import com.f4.forum.dto.RoomCommand;
import com.f4.forum.entity.Branch;
import com.f4.forum.entity.Room;
import com.f4.forum.repository.BranchRepository;
import com.f4.forum.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service xử lý nghiệp vụ cho Phòng học (Room).
 * Tuân thủ Rich Domain Model: Logic nghiệp vụ thực thi trên Entity.
 */
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BranchRepository branchRepository;

    @Transactional(readOnly = true)
    public List<Room> findAllByBranchId(Long branchId) {
        return roomRepository.findAllByBranchId(branchId);
    }

    @Transactional
    public Room create(Long branchId, RoomCommand command) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi nhánh với ID: " + branchId));

        Room room = Room.builder()
                .name(command.name())
                .capacity(command.capacity())
                .roomType(command.roomType())
                .branch(branch)
                .build();

        return roomRepository.save(room);
    }

    @Transactional
    public Room update(Long roomId, RoomCommand command) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng với ID: " + roomId));

        // Thực thi hành vi trên Rich Domain Model
        room.updateOperationalInfo(command.name(), command.capacity(), command.roomType());

        return roomRepository.save(room);
    }

    @Transactional
    public void delete(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new EntityNotFoundException("Không tìm thấy phòng với ID: " + roomId);
        }
        roomRepository.deleteById(roomId);
    }
}
