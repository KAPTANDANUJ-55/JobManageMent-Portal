package com.jobportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    private String title;
    private String category;
    
    @JsonProperty("jobType")
    private String jobType;
    
    private String experienceLevel;
    private String workMode;
    private String location;
    
    private Long minSalary;
    private Long maxSalary;
    
    @JsonProperty("salaryMin")
    public void setSalaryMin(Long min) {
        if (min != null) this.minSalary = min;
    }
    
    @JsonProperty("salaryMax")
    public void setSalaryMax(Long max) {
        if (max != null) this.maxSalary = max;
    }
    
    @JsonProperty("type")
    public void setType(String type) {
        if (type != null) this.jobType = type;
    }

    private String description;
    private List<String> responsibilities;
    private List<String> requirements;
    private List<String> perks;
    private List<String> skills;
    private String status;
    private Boolean featured;
    private String deadline;
}
