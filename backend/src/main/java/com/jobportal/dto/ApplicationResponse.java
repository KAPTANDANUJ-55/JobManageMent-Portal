package com.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobportal.model.ApplicationHistory;
import com.jobportal.model.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private Long userId;
    private String status;
    private String coverLetter;
    private String resumeUrl;
    private String resumeName;
    private String expectedCtc;
    private String noticePeriod;
    private String portfolioUrl;
    private String appliedAt;
    private String createdAt;
    private String updatedAt;

    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String experienceYears;

    private List<ApplicationHistory> history;
    private JobResponse job;
    private User candidate;

    @JsonProperty("jobTitle")
    public String getJobTitle() {
        return job != null ? job.getTitle() : null;
    }

    @JsonProperty("companyName")
    public String getCompanyName() {
        return (job != null && job.getCompany() != null) ? job.getCompany().getName() : null;
    }
}
