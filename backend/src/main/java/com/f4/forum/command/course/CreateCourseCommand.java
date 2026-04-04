package com.f4.forum.command.course;

import com.f4.forum.command.AbstractCommand;
import com.f4.forum.entity.Course;
import com.f4.forum.entity.enums.CourseStatus;
import com.f4.forum.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;

/**
 * ===== COMMAND PATTERN =====
 * Command tạo mới khóa học.
 * Có khả năng undo (xóa course vừa tạo).
 */
@Slf4j
@RequiredArgsConstructor
public class CreateCourseCommand extends AbstractCommand<Course> {

    private final CourseRepository courseRepository;
    
    private final String code;
    private final String name;
    private final String description;
    private final String category;
    private final String level;
    private final BigDecimal fee;
    private final CourseStatus status;
    private final Integer maxEnrollment;
    private final String imageUrl;
    private final String imageColor;

    private Course createdCourse;

    @Override
    protected Course doExecute() {
        Course course = Course.builder()
                .code(code)
                .name(name)
                .description(description)
                .category(category)
                .level(level)
                .fee(fee)
                .status(status != null ? status : CourseStatus.DRAFT)
                .maxEnrollment(maxEnrollment)
                .currentEnrollment(0)
                .imageUrl(imageUrl)
                .imageColor(imageColor)
                .build();
        
        createdCourse = courseRepository.save(course);
        log.info("Đã tạo course: {} (ID: {})", createdCourse.getName(), createdCourse.getId());
        
        return createdCourse;
    }

    @Override
    public void undo() {
        if (createdCourse != null && createdCourse.getId() != null) {
            courseRepository.delete(createdCourse);
            log.info("Đã rollback: Xóa course ID {}", createdCourse.getId());
        }
    }

    @Override
    public boolean canUndo() {
        return createdCourse != null && createdCourse.getId() != null;
    }

    @Override
    public String getCommandName() {
        return "CreateCourseCommand";
    }
}
