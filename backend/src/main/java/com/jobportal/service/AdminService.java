package com.jobportal.service;

import com.jobportal.dto.AdminStatsResponse;
import com.jobportal.dto.CategoryStat;
import com.jobportal.dto.MonthlyTrend;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    public AdminStatsResponse getStats() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long seekers = users.stream().filter(u -> "JOB_SEEKER".equalsIgnoreCase(u.getRole()) || "SEEKER".equalsIgnoreCase(u.getRole())).count();
        long recruiters = users.stream().filter(u -> "RECRUITER".equalsIgnoreCase(u.getRole())).count();

        List<Job> jobs = jobRepository.findAll();
        long totalJobs = jobs.size();
        long activeJobs = jobs.stream().filter(j -> "OPEN".equalsIgnoreCase(j.getStatus())).count();
        long pendingJobs = jobs.stream().filter(j -> "PENDING".equalsIgnoreCase(j.getStatus())).count();

        long totalApplications = applicationRepository.count();
        long totalCompanies = companyRepository.count();

        List<MonthlyTrend> monthlyTrends = Arrays.asList(
                new MonthlyTrend("Jan", 120, 18, 45),
                new MonthlyTrend("Feb", 180, 24, 70),
                new MonthlyTrend("Mar", 240, 32, 110),
                new MonthlyTrend("Apr", 310, 45, 155),
                new MonthlyTrend("May", 420, 58, 210),
                new MonthlyTrend("Jun", 510, 64, 280)
        );

        List<CategoryStat> categoryStats = Arrays.asList(
                new CategoryStat("Engineering", jobs.stream().filter(j -> "Engineering".equalsIgnoreCase(j.getCategory())).count()),
                new CategoryStat("Design", jobs.stream().filter(j -> "Design".equalsIgnoreCase(j.getCategory())).count()),
                new CategoryStat("Product", jobs.stream().filter(j -> "Product".equalsIgnoreCase(j.getCategory())).count()),
                new CategoryStat("Data", jobs.stream().filter(j -> j.getCategory() != null && j.getCategory().contains("Data")).count()),
                new CategoryStat("Marketing", jobs.stream().filter(j -> "Marketing".equalsIgnoreCase(j.getCategory())).count())
        );

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .seekers(seekers)
                .recruiters(recruiters)
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .pendingJobs(pendingJobs)
                .totalApplications(totalApplications)
                .totalCompanies(totalCompanies)
                .monthlyTrends(monthlyTrends)
                .categoryStats(categoryStats)
                .build();
    }
}
