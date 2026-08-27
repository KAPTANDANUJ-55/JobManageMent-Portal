package com.jobportal.dto.jobapplication;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ApplyJobRequest {
    @NotNull(message = "Job ID is required to apply")
    private Long jobId;
}
