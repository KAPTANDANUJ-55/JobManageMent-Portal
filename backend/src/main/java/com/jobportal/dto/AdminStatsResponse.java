package com.jobportal.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long seekers;
    private long recruiters;
    private long totalJobs;
    private long activeJobs;
    private long pendingJobs;
    private long totalApplications;
    private long totalCompanies;
    private List<MonthlyTrend> monthlyTrends;
    private List<CategoryStat> categoryStats;
}
