package com.f4.forum.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * ScheduleDTO - Data Transfer Object phục vụ hiển thị lịch học của học viên.
 * Sử dụng Java 21 Record để đảm bảo tối ưu bộ nhớ và tính bất biến (Immutability).
 * 
 * @param scheduleId ID của buổi học
 * @param date Ngày học
 * @param startTime Giờ bắt đầu
 * @param endTime Giờ kết thúc
 * @param isOnline Học trực tuyến hay tại phòng
 * @param meetingLink Link họp trực tuyến (nếu có)
 * @param className Mã lớp học (e.g., FON-2026-01)
 * @param courseName Tên khóa học (e.g., IELTS Foundation)
 * @param courseColor Mã màu nhận diện của khóa học
 * @param roomName Tên phòng học hoặc "Trực tuyến"
 * @param isPresent Trạng thái điểm danh (true: có mặt, false: vắng hoặc chưa điểm danh)
 */
public record ScheduleDTO(
    Long scheduleId,
    LocalDate date,
    LocalTime startTime,
    LocalTime endTime,
    Boolean isOnline,
    String meetingLink,
    String className,
    String courseName,
    String courseColor,
    String roomName,
    Boolean isPresent
) {
}
