package com.f4.forum.event;

import com.f4.forum.event.course.*;
import com.f4.forum.event.enrollment.*;
import com.f4.forum.event.user.*;
import com.f4.forum.event.invoice.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GlobalEventListener {

    @Async
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        log.info("👤 [User Event] User created: {} (ID: {}) with role: {}", 
                event.getUsername(), event.getUserId(), event.getRole());
    }

    @Async
    @EventListener
    public void handleUserUpdated(UserUpdatedEvent event) {
        log.info("✏️ [User Event] User updated: {} (ID: {}), field: {}", 
                event.getUsername(), event.getUserId(), event.getUpdatedField());
    }

    @Async
    @EventListener
    public void handleCourseCreated(CourseCreatedEvent event) {
        log.info("📚 [Course Event] Course created: {} ({}) (ID: {})", 
                event.getCourseName(), event.getCourseCode(), event.getCourseId());
    }

    @Async
    @EventListener
    public void handleCourseUpdated(CourseUpdatedEvent event) {
        log.info("✏️ [Course Event] Course updated: {} (ID: {}), field: {}", 
                event.getCourseName(), event.getCourseId(), event.getUpdatedField());
    }

    @Async
    @EventListener
    public void handleCourseArchived(CourseArchivedEvent event) {
        log.info("📦 [Course Event] Course archived: {} (ID: {})", 
                event.getCourseName(), event.getCourseId());
    }

    @Async
    @EventListener
    public void handleEnrollmentAdded(EnrollmentAddedEvent event) {
        log.info("✅ [Enrollment Event] Student {} enrolled in class {} (enrollment ID: {})", 
                event.getStudentId(), event.getClassCode(), event.getEnrollmentId());
    }

    @Async
    @EventListener
    public void handleEnrollmentDropped(EnrollmentDroppedEvent event) {
        log.info("❌ [Enrollment Event] Student {} dropped from class {} (reason: {})", 
                event.getStudentId(), event.getClassId(), event.getReason());
    }

    @Async
    @EventListener
    public void handleInvoiceCreated(InvoiceCreatedEvent event) {
        log.info("📄 [Invoice Event] Invoice created: {} for student {} ({}) - Amount: {}", 
                event.getInvoiceCode(), event.getStudentName(), event.getStudentEmail(), event.getFinalAmount());
    }

    @Async
    @EventListener
    public void handleInvoicePaid(InvoicePaidEvent event) {
        log.info("💰 [Invoice Event] Invoice paid: {} by student {} - Amount: {}", 
                event.getInvoiceCode(), event.getStudentName(), event.getAmountPaid());
    }
}
