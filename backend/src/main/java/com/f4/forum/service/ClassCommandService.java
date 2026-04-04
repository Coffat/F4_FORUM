package com.f4.forum.service;

import com.f4.forum.dto.request.CreateClassCommand;
import com.f4.forum.dto.request.UpdateClassCommand;
import com.f4.forum.entity.ClassEntity;
import com.f4.forum.entity.Course;
import com.f4.forum.entity.Room;
import com.f4.forum.repository.ClassRepository;
import com.f4.forum.repository.CourseRepository;
import com.f4.forum.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CQRS - Command Service: Xử lý thay đổi logic & nghiệp vụ cốt lõi.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClassCommandService {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final RoomRepository roomRepository;

    public Long createClass(CreateClassCommand command) {
        Course course = courseRepository.findById(command.courseId())
                .orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại."));
        
        Room room = null;
        if (command.roomId() != null) {
            room = roomRepository.findById(command.roomId())
                    .orElseThrow(() -> new IllegalArgumentException("Phòng học không tồn tại."));
            // Business Requirement Validation
            if (command.maxStudents() > room.getCapacity()) {
                throw new IllegalArgumentException("Số sinh viên tối đa không được vượt quá sức chứa của phòng (" + room.getCapacity() + ").");
            }
        }

        ClassEntity newClass = ClassEntity.builder()
                .course(course)
                .defaultRoom(room)
                .classCode(command.classCode())
                .startDate(command.startDate())
                .endDate(command.endDate())
                .maxStudents(command.maxStudents())
                .build();

        return classRepository.save(newClass).getId();
    }

    public void updateClass(Long id, UpdateClassCommand command) {
        ClassEntity existing = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lớp học không tồn tại."));

        if (command.roomId() != null) {
            Room room = roomRepository.findById(command.roomId())
                    .orElseThrow(() -> new IllegalArgumentException("Phòng học không tồn tại."));
            if (command.maxStudents() > room.getCapacity()) {
                throw new IllegalArgumentException("Số sinh viên tối đa không được vượt quá sức chứa của phòng (" + room.getCapacity() + ").");
            }
            existing.setDefaultRoom(room);
        }

        existing.setStartDate(command.startDate());
        existing.setEndDate(command.endDate());
        existing.setMaxStudents(command.maxStudents());
        
        classRepository.save(existing);
    }

    public void cancelClass(Long id) {
        ClassEntity existing = classRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lớp học không tồn tại."));
        
        // Gọi Domain Logic (Tell, Don't Ask)
        existing.cancelClass();
        classRepository.save(existing);
    }
}
