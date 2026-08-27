package com.jobportal.dto.jobapplication;

import com.jobportal.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Application status cannot be null")
    private ApplicationStatus status;
}