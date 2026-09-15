package com.jobportal.service;

import com.jobportal.dto.job.JobRequest;
import com.jobportal.dto.job.JobResponse;
import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.User;
import com.jobportal.repository.CompanyRepo;
import com.jobportal.repository.JobRepo;
import com.jobportal.repository.RecruiterRepo;
import com.jobportal.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        Company company = companyRepo.findById(jobRequest.getCompanyId()).orElseThrow(() -> new RuntimeException("Company with ID: " + jobRequest.getCompanyId() + " not found!"));
        if (!company.getRecruiter().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized: You do not own this company profile");
        }

        Job job = Job.builder()
                .title(jobRequest.getTitle())
                .description(jobRequest.getDescription())
                .location(jobRequest.getLocation())
                .jobType(jobRequest.getJobType())
                .salaryMin(jobRequest.getSalaryMin())
                .salaryMax(jobRequest.getSalaryMax())
                .requiredSkills(jobRequest.getRequiredSkills())
                .company(company)
                .recruiterId(recruiter.getId())
                .recruiterName(recruiter.getFullName())
                .postedAt(LocalDateTime.now())
                .build();

        Job savedJob = jobRepo.save(job);
        return mapToResponse(savedJob);
    }

    public JobResponse updateJob(Long jobId,JobRequest jobRequest, Long recruiterId) {
        Job job = jobRepo.findByid(jobId).orElseThrow(() -> new RuntimeException("Job with ID: " + jobId + " not found!"));

        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setLocation(jobRequest.getLocation());
        job.setJobType(jobRequest.getJobType());
        job.setSalaryMin(jobRequest.getSalaryMin());
        job.setSalaryMax(jobRequest.getSalaryMax());
        job.setRecruiterId(recruiterId);
        job.setRequiredSkills(jobRequest.getRequiredSkills());
        jobRepo.save(job);
        return mapToResponse(job);

    }


    public JobResponse toggleJob(Long jobId, Long recruiterId) {
        Job job = jobRepo.findByid(jobId).orElseThrow(() -> new RuntimeException("Job with ID: " + jobId + " not found!"));

        if(!job.getPostedBy().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized: You do not own this company profile");
        }
        job.setActive(!job.isActive());
        jobRepo.save(job);

        return mapToResponse(job);
    }

    public JobResponse deleteJob(Long jobId, Long recruiterId) {
        Job job = jobRepo.findByid(jobId).orElseThrow(() -> new RuntimeException("Job with ID: " + jobId + " not found!"));

        if(!job.getPostedBy().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized: You do not own this company profile");
        }

        jobRepo.delete(job);
        return mapToResponse(job);
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
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getCompanyname())
                .salaryMax(job.getSalaryMax()).recruiterId(job.getRecruiterId())
                .recruiterName(job.getRecruiterName())
                .postedAt(job.getPostedAt())
                .build();
    }


}
