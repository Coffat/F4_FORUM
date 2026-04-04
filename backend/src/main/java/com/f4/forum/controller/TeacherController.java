package com.f4.forum.controller;

import com.f4.forum.dto.response.TeacherProfileResponse;
import com.f4.forum.dto.response.TeacherOverviewResponse;
import com.f4.forum.dto.request.CreateTeacherAssignmentCommand;
import com.f4.forum.dto.request.UpdateTeacherAssignmentCommand;
import com.f4.forum.dto.request.UpdateTeacherAttendanceCommand;
import com.f4.forum.dto.request.UpdateTeacherGradesCommand;
import com.f4.forum.service.TeacherProfileFacade;
import com.f4.forum.service.TeacherOverviewFacade;
import com.f4.forum.service.TeacherClassesFacade;
import com.f4.forum.service.TeacherAssignmentFacade;
import com.f4.forum.service.TeacherStudentFacade;
import com.f4.forum.service.TeacherAttendanceFacade;
import com.f4.forum.service.TeacherGradesFacade;
import com.f4.forum.service.TeacherScheduleFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher Portal", description = "APIs phục vụ Teacher Portal (Profile, Classes, Schedule, ...)")
public class TeacherController {

    private final TeacherProfileFacade teacherProfileFacade;
    private final TeacherOverviewFacade teacherOverviewFacade;
    private final TeacherClassesFacade teacherClassesFacade;
    private final TeacherAssignmentFacade teacherAssignmentFacade;
    private final TeacherStudentFacade teacherStudentFacade;
    private final TeacherAttendanceFacade teacherAttendanceFacade;
    private final TeacherGradesFacade teacherGradesFacade;
    private final TeacherScheduleFacade teacherScheduleFacade;

    @GetMapping("/me")
    @Operation(
            summary = "Lấy hồ sơ giảng viên hiện tại",
            description = "Dành cho Teacher Portal. Hiện tại parse username từ mock token (mock_token_for_<username>)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về hồ sơ giảng viên"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền (chuỗi text lỗi)")
    })
    public ResponseEntity<?> getMyProfile(
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            TeacherProfileResponse response = teacherProfileFacade.getMyProfile(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/overview")
    @Operation(
            summary = "Lấy metrics tổng quan cho Teacher Profile",
            description = "Trả về 3 metrics: lớp đang dạy, bài chờ chấm, buổi dạy trong tuần. Parse username từ mock token."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về metrics"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền (chuỗi text lỗi)")
    })
    public ResponseEntity<?> getMyOverview(
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            TeacherOverviewResponse response = teacherOverviewFacade.getMyOverview(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me/classes")
    @Operation(
            summary = "Lấy danh sách lớp mà giảng viên đang/đã dạy",
            description = "Trả về list lớp với số học viên active và số buổi trong tuần cho tab Lớp."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công - trả về danh sách lớp"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền (chuỗi text lỗi)")
    })
    public ResponseEntity<?> getMyClasses(
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherClassesFacade.getMyClasses(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes/{classId}/assignments")
    @Operation(
            summary = "Lấy danh sách bài tập của một lớp",
            description = "Dành cho teacher sở hữu lớp đó."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền")
    })
    public ResponseEntity<?> getClassAssignments(
            @PathVariable Long classId,
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherAssignmentFacade.getAssignments(classId, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes/{classId}/students")
    @Operation(
            summary = "Lấy tất cả học viên của lớp",
            description = "Dành cho teacher sở hữu lớp đó."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thành công"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ hoặc không có quyền")
    })
    public ResponseEntity<?> getClassStudents(
            @PathVariable Long classId,
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherStudentFacade.getClassStudents(classId, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/classes/{classId}/assignments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Tạo bài tập mới cho lớp",
            description = "Nhập tiêu đề, mô tả, hạn nộp, điểm tối đa và file đính kèm (optional)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tạo bài tập thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc không có quyền")
    })
    public ResponseEntity<?> createAssignment(
            @PathVariable Long classId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "dueDateTime", required = false) String dueDateTime,
            @RequestParam(value = "maxScore", required = false) String maxScore,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @Parameter(description = "Bearer <token> (token mock từ /api/v1/auth/login)")
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            String originalFileName = (file == null || file.isEmpty()) ? null : file.getOriginalFilename();
            LocalDateTime parsedDueDateTime = (dueDateTime == null || dueDateTime.isBlank())
                    ? null
                    : LocalDateTime.parse(dueDateTime);
            BigDecimal parsedMaxScore = (maxScore == null || maxScore.isBlank())
                    ? null
                    : new BigDecimal(maxScore);

            CreateTeacherAssignmentCommand command = new CreateTeacherAssignmentCommand(
                    title,
                    description,
                    parsedDueDateTime,
                    parsedMaxScore
            );
            return ResponseEntity.ok(teacherAssignmentFacade.createAssignment(classId, token, command, originalFileName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/classes/{classId}/assignments/{assignmentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Cập nhật bài tập của lớp", description = "Sửa tiêu đề/mô tả/hạn nộp/điểm tối đa và thay file đính kèm (optional).")
    public ResponseEntity<?> updateAssignment(
            @PathVariable Long classId,
            @PathVariable Long assignmentId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "dueDateTime", required = false) String dueDateTime,
            @RequestParam(value = "maxScore", required = false) String maxScore,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            String originalFileName = (file == null || file.isEmpty()) ? null : file.getOriginalFilename();
            LocalDateTime parsedDueDateTime = (dueDateTime == null || dueDateTime.isBlank())
                    ? null
                    : LocalDateTime.parse(dueDateTime);
            BigDecimal parsedMaxScore = (maxScore == null || maxScore.isBlank())
                    ? null
                    : new BigDecimal(maxScore);

            UpdateTeacherAssignmentCommand command = new UpdateTeacherAssignmentCommand(
                    title,
                    description,
                    parsedDueDateTime,
                    parsedMaxScore
            );
            return ResponseEntity.ok(teacherAssignmentFacade.updateAssignment(classId, assignmentId, token, command, originalFileName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/classes/{classId}/assignments/{assignmentId}")
    @Operation(summary = "Xóa bài tập của lớp")
    public ResponseEntity<?> deleteAssignment(
            @PathVariable Long classId,
            @PathVariable Long assignmentId,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            teacherAssignmentFacade.deleteAssignment(classId, assignmentId, token);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes/{classId}/attendance/sessions")
    @Operation(summary = "Lấy danh sách buổi học của lớp để điểm danh")
    public ResponseEntity<?> getAttendanceSessions(
            @PathVariable Long classId,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherAttendanceFacade.getClassSessions(classId, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes/{classId}/attendance")
    @Operation(summary = "Lấy danh sách học viên và trạng thái điểm danh theo buổi")
    public ResponseEntity<?> getAttendanceSheet(
            @PathVariable Long classId,
            @RequestParam("scheduleId") Long scheduleId,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherAttendanceFacade.getAttendanceSheet(classId, scheduleId, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/classes/{classId}/attendance")
    @Operation(summary = "Lưu điểm danh cho 1 buổi học")
    public ResponseEntity<?> saveAttendance(
            @PathVariable Long classId,
            @RequestParam("scheduleId") Long scheduleId,
            @RequestBody UpdateTeacherAttendanceCommand command,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherAttendanceFacade.saveAttendance(classId, scheduleId, token, command));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes/{classId}/grades")
    @Operation(summary = "Lấy bảng nhập điểm theo lớp")
    public ResponseEntity<?> getGradesSheet(
            @PathVariable Long classId,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherGradesFacade.getGradesSheet(classId, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/classes/{classId}/grades")
    @Operation(summary = "Lưu điểm cho lớp")
    public ResponseEntity<?> saveGrades(
            @PathVariable Long classId,
            @RequestBody UpdateTeacherGradesCommand command,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            return ResponseEntity.ok(teacherGradesFacade.saveGrades(classId, token, command));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/me/schedule")
    @Operation(summary = "Lấy lịch dạy theo khoảng ngày")
    public ResponseEntity<?> getMySchedule(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Thiếu Authorization Bearer token!");
            }
            String token = authorizationHeader.substring("Bearer ".length()).trim();
            LocalDate fromDate = LocalDate.parse(from);
            LocalDate toDate = LocalDate.parse(to);
            return ResponseEntity.ok(teacherScheduleFacade.getMySchedule(token, fromDate, toDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

