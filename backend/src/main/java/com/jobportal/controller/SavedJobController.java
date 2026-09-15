package com.jobportal.controller;

import com.jobportal.dto.JobResponse;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @GetMapping
    public ResponseEntity<List<JobResponse>> getSavedJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(savedJobService.getSavedJobs(userDetails.getId()));
    }

    @PostMapping("/toggle/{jobId}")
    public ResponseEntity<Map<String, Object>> toggleSaveJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long jobId
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(savedJobService.toggleSaveJob(userDetails.getId(), jobId));
    }

    @GetMapping("/check/{jobId}")
    public ResponseEntity<Map<String, Object>> checkJobSaved(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long jobId
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        if (userId == null) {
            return ResponseEntity.ok(Map.of("saved", false, "isSaved", false, "jobId", jobId));
        }
        return ResponseEntity.ok(savedJobService.checkJobSaved(userId, jobId));
    }
}
