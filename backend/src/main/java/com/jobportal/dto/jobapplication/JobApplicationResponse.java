package com.jobportal.dto.jobapplication;

import com.jobportal.entity.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    private Long id;

    private Long jobId;
    private String jobTitle;
    private String jobDescription;
    private String companyName;
    private String companyEmail;

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String resumeUrl;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
