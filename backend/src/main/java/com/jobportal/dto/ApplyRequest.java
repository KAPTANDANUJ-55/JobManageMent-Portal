package com.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyRequest {
    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverLetter;
    
    @JsonProperty("coverNote")
    public void setCoverNote(String note) {
        if (note != null) this.coverLetter = note;
    }

    private String resumeUrl;
    private String resumeName;
    private String expectedCtc;
    private String noticePeriod;
    private String portfolioUrl;

    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String experienceYears;
}
