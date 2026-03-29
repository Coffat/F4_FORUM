package com.f4.forum.controller;

import com.f4.forum.dto.response.StaffDirectoryResponse;
import com.f4.forum.dto.response.StaffStatsResponse;
import com.f4.forum.service.PersonnelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    @Operation(summary = "Get all personnel", description = "Retrieves a unified list of teachers and staff members")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved directory list")
    })
    public ResponseEntity<List<StaffDirectoryResponse>> getAllPersonnel() {
        return ResponseEntity.ok(personnelService.getStaffDirectory());
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
