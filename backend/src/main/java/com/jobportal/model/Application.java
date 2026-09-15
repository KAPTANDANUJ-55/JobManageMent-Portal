package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Long userId;

    @Builder.Default
    private String status = "APPLIED"; // "APPLIED", "IN_REVIEW", "SHORTLISTED", "INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    private String resumeUrl;
    private String resumeName;
    private String expectedCtc;
    private String noticePeriod;
    private String portfolioUrl;

    private String appliedAt;
    private String createdAt;
    private String updatedAt;

    // Transient or denormalized candidate details for direct consumption
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String experienceYears;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "application_history", joinColumns = @JoinColumn(name = "application_id"))
    @Builder.Default
    private List<ApplicationHistory> history = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        String now = Instant.now().toString();
        if (createdAt == null) createdAt = now;
        if (appliedAt == null) appliedAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = "APPLIED";
        if (history == null || history.isEmpty()) {
            history = new ArrayList<>();
            history.add(new ApplicationHistory("APPLIED", now, "Application submitted by candidate"));
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now().toString();
    }
}
