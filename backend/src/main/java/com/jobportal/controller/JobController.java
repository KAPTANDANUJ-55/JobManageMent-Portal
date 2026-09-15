package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.JobListResponse;
import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<JobListResponse> getJobs(
            @RequestParam(required = false, name = "query") String query,
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "search") String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, name = "jobType") String jobType,
            @RequestParam(required = false, name = "type") String type,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) Long minSalary,
            @RequestParam(required = false) Long maxSalary,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long recruiterId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(required = false, name = "sort") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false, defaultValue = "false") Boolean includeAllStatuses
    ) {
        String searchQuery = query != null ? query : (search != null ? search : q);
        String jType = jobType != null ? jobType : type;
        String sBy = sort != null ? sort : sortBy;

        return ResponseEntity.ok(jobService.getJobs(
                searchQuery, location, category, jType, experienceLevel, workMode,
                minSalary, maxSalary, companyId, recruiterId, status, sBy, page, limit, includeAllStatuses
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody JobRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(userDetails.getUser(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody JobRequest request
    ) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(new ApiResponse(true, "Job deleted successfully"));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponse>> getJobApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId));
    }
}
