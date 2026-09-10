package com.jobportal.service;

import com.jobportal.dto.job.JobRequest;
import com.jobportal.dto.job.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.User;
import com.jobportal.repository.CompanyRepo;
import com.jobportal.repository.JobRepo;
import com.jobportal.repository.RecruiterRepo;
import com.jobportal.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JobService {
 private final JobRepo jobRepo;
 private final CompanyRepo companyRepo;
 private final RecruiterRepo recruiterRepo;

    public JobService(JobRepo jobRepo, CompanyRepo companyRepo, RecruiterRepo recruiterRepo) {
        this.jobRepo = jobRepo;
        this.companyRepo = companyRepo;
        this.recruiterRepo = recruiterRepo;
    }


    public JobResponse postJob(JobRequest jobRequest, Long recruiterId) {
        Recruiter recruiter = recruiterRepo.findById(recruiterId).orElseThrow(() -> new RuntimeException("Company with ID: " + recruiterId + " not found!"));
          return null
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .requiredSkills(job.getRequiredSkills())
                .active(job.isActive())
                .companyId(job.getCompany().getCompanyid())
                .companyName(job.getCompany().getCompanyname())
                .salaryMax(job.getSalaryMax()).recruiterId(job.getRecruiterId())
                .recruiterName(job.getRecruiterName())
                .postedAt(job.getPostedAt())
                .build();
    }


}
