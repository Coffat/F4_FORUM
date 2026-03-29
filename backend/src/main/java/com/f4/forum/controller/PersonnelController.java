package com.f4.forum.controller;

import com.f4.forum.dto.response.StaffDirectoryResponse;
import com.f4.forum.dto.response.StaffStatsResponse;
import com.f4.forum.service.PersonnelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/v1/personnel")
@RequiredArgsConstructor
@Tag(name = "Personnel Management", description = "APIs for managing staff and teachers")
public class PersonnelController {

    private final PersonnelService personnelService;

    @GetMapping
    @Operation(summary = "Get all personnel", description = "Retrieves teachers and staff; optional search (name, email, phone, specialty/dept) and segment (ALL, ACADEMIC, ADMINISTRATIVE).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved directory list")
    })
    public ResponseEntity<List<StaffDirectoryResponse>> getAllPersonnel(
            @Parameter(description = "Case-insensitive partial match on name, email, phone, or specialty/department")
            @RequestParam(required = false) String search,
            @Parameter(description = "ALL | ACADEMIC (teachers only) | ADMINISTRATIVE (staff only)")
            @RequestParam(required = false, defaultValue = "ALL") String segment
    ) {
        return ResponseEntity.ok(personnelService.getStaffDirectory(search, segment));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get personnel statistics", description = "Retrieves summarized metrics for the staff management dashboard")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully computed stats")
    })
    public ResponseEntity<StaffStatsResponse> getPersonnelStats() {
        return ResponseEntity.ok(personnelService.getStaffStats());
    }
}
