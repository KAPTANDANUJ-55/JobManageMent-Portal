package com.jobportal.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recruiterId;
    private Long companyId;

    @Column(nullable = false)
    private String title;

    private String category;

    @JsonProperty("jobType")
    private String jobType;

    private String experienceLevel;
    private String workMode;
    private String location;

    private Long minSalary;
    private Long maxSalary;

    @Builder.Default
    private String salaryPeriod = "year";

    @Builder.Default
    private Integer openings = 1;

    @Builder.Default
    private String status = "OPEN"; // "OPEN", "CLOSED", "PENDING"

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Long viewsCount = 0L;

    private String deadline;
    private String postedAt;
    private String createdAt;
    private String updatedAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_responsibilities", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "responsibility", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> responsibilities = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> requirements = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_perks", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "perk")
    @Builder.Default
    private List<String> perks = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    // Compatibility getters for frontend naming
    @JsonProperty("type")
    public String getType() {
        return jobType;
    }

    @JsonProperty("type")
    public void setType(String type) {
        this.jobType = type;
    }

    @JsonProperty("salaryMin")
    public Long getSalaryMin() {
        return minSalary;
    }

    @JsonProperty("salaryMin")
    public void setSalaryMin(Long min) {
        this.minSalary = min;
    }

    @JsonProperty("salaryMax")
    public Long getSalaryMax() {
        return maxSalary;
    }

    @JsonProperty("salaryMax")
    public void setSalaryMax(Long max) {
        this.maxSalary = max;
    }

    @JsonProperty("views")
    public Long getViews() {
        return viewsCount;
    }

    @JsonProperty("views")
    public void setViews(Long v) {
        this.viewsCount = v;
    }

    @JsonProperty("benefits")
    public List<String> getBenefits() {
        return perks;
    }

    @JsonProperty("benefits")
    public void setBenefits(List<String> b) {
        this.perks = b;
    }

    @PrePersist
    public void prePersist() {
        String now = Instant.now().toString();
        if (createdAt == null) createdAt = now;
        if (postedAt == null) postedAt = now;
        if (updatedAt == null) updatedAt = now;
        if (viewsCount == null) viewsCount = 0L;
        if (status == null) status = "OPEN";
        if (featured == null) featured = false;
        if (openings == null) openings = 1;
        if (salaryPeriod == null) salaryPeriod = "year";
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now().toString();
    }
}
