package com.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jobportal.model.Company;
import com.jobportal.model.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private Long recruiterId;
    private Long companyId;
    private String title;
    private String category;
    private String jobType;
    private String experienceLevel;
    private String workMode;
    private String location;
    private Long minSalary;
    private Long maxSalary;
    private String salaryPeriod;
    private Integer openings;
    private String status;
    private Boolean featured;
    private Long viewsCount;
    private String deadline;
    private String postedAt;
    private String createdAt;
    private String updatedAt;
    private String description;
    private List<String> responsibilities;
    private List<String> requirements;
    private List<String> perks;
    private List<String> skills;

    private Company company;
    private Long applicantCount;
    private User recruiter;
    private String savedAt;

    @JsonProperty("companyName")
    public String getCompanyName() {
        return company != null ? company.getName() : null;
    }

    @JsonProperty("type")
    public String getType() {
        return jobType;
    }

    @JsonProperty("salaryMin")
    public Long getSalaryMin() {
        return minSalary;
    }

    @JsonProperty("salaryMax")
    public Long getSalaryMax() {
        return maxSalary;
    }

    @JsonProperty("views")
    public Long getViews() {
        return viewsCount;
    }

    @JsonProperty("benefits")
    public List<String> getBenefits() {
        return perks;
    }
}
