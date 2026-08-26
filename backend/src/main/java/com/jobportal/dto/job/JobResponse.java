package com.jobportal.dto.job;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String jobType;
    private Double salaryMin;
    private Double salaryMax;
    private String requiredSkills;
    private boolean active;
    private LocalDateTime postedAt;

    // Flat representation of foreign relations
    private Long companyId;
    private String companyName;
    private Long postedById;
    private String postedByName;
}