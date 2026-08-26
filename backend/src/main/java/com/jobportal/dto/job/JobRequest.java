package com.jobportal.dto.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String location;
    private String jobType; // FULL_TIME, REMOTE, INTERNSHIP

    @Positive(message = "Minimum salary must be positive")
    private Double salaryMin;

    @Positive(message = "Maximum salary must be positive")
    private Double salaryMax;

    private String requiredSkills;

    @NotNull(message = "Company ID is mandatory")
    private Long companyId;
}