package com.jobportal.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String location;

    private String jobType; // e.g., FULL_TIME, PART_TIME, REMOTE

    private Double salaryMin;

    private Double salaryMax;

    private String requiredSkills;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "posted_by_id")
    private User postedBy;
    private boolean Active = true;
    private LocalDateTime postedAt = LocalDateTime.now();

}

