package com.jobportal.dto.savedjob;

import jakarta.validation.constraints.NotNull;

public class savedJobRequest
{
    @NotNull(message = "Job-Id is required")
    private Long Id;
    // No field is required to request for user
}
