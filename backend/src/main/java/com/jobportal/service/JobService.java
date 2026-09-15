package com.jobportal.service;

import com.jobportal.dto.JobListResponse;
import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.Notification;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;

    public JobListResponse getJobs(
            String query,
            String location,
            String category,
            String jobType,
            String experienceLevel,
            String workMode,
            Long minSalary,
            Long maxSalary,
            Long companyId,
            Long recruiterId,
            String status,
            String sortBy,
            Integer page,
            Integer limit,
            Boolean includeAllStatuses
    ) {
        List<Job> allJobs = jobRepository.findAll();

        // Filter by status
        if (Boolean.TRUE.equals(includeAllStatuses)) {
            // Include all
        } else if (status != null && !status.isBlank()) {
            allJobs = allJobs.stream()
                    .filter(j -> status.equalsIgnoreCase(j.getStatus()))
                    .collect(Collectors.toList());
        } else {
            allJobs = allJobs.stream()
                    .filter(j -> "OPEN".equalsIgnoreCase(j.getStatus()))
                    .collect(Collectors.toList());
        }

        // Search query
        if (query != null && !query.isBlank()) {
            String q = query.trim().toLowerCase();
            allJobs = allJobs.stream().filter(j -> {
                boolean matchTitle = j.getTitle() != null && j.getTitle().toLowerCase().contains(q);
                boolean matchDesc = j.getDescription() != null && j.getDescription().toLowerCase().contains(q);
                boolean matchSkills = j.getSkills() != null && j.getSkills().stream().anyMatch(s -> s.toLowerCase().contains(q));
                boolean matchCompany = false;
                if (j.getCompanyId() != null) {
                    Company c = companyRepository.findById(j.getCompanyId()).orElse(null);
                    if (c != null && c.getName() != null && c.getName().toLowerCase().contains(q)) {
                        matchCompany = true;
                    }
                }
                return matchTitle || matchDesc || matchSkills || matchCompany;
            }).collect(Collectors.toList());
        }

        // Location
        if (location != null && !location.isBlank()) {
            String loc = location.trim().toLowerCase();
            allJobs = allJobs.stream().filter(j ->
                    (j.getLocation() != null && j.getLocation().toLowerCase().contains(loc)) ||
                    (j.getWorkMode() != null && j.getWorkMode().toLowerCase().contains(loc))
            ).collect(Collectors.toList());
        }

        // Category
        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            allJobs = allJobs.stream().filter(j -> category.equalsIgnoreCase(j.getCategory())).collect(Collectors.toList());
        }

        // Job Type
        if (jobType != null && !jobType.isBlank() && !"All".equalsIgnoreCase(jobType)) {
            allJobs = allJobs.stream().filter(j -> jobType.equalsIgnoreCase(j.getJobType())).collect(Collectors.toList());
        }

        // Experience Level
        if (experienceLevel != null && !experienceLevel.isBlank() && !"All".equalsIgnoreCase(experienceLevel)) {
            allJobs = allJobs.stream().filter(j -> experienceLevel.equalsIgnoreCase(j.getExperienceLevel())).collect(Collectors.toList());
        }

        // Work Mode
        if (workMode != null && !workMode.isBlank() && !"All".equalsIgnoreCase(workMode)) {
            allJobs = allJobs.stream().filter(j -> workMode.equalsIgnoreCase(j.getWorkMode())).collect(Collectors.toList());
        }

        // Min & Max Salary
        if (minSalary != null) {
            allJobs = allJobs.stream().filter(j -> j.getMaxSalary() != null ? j.getMaxSalary() >= minSalary : true).collect(Collectors.toList());
        }
        if (maxSalary != null) {
            allJobs = allJobs.stream().filter(j -> j.getMinSalary() != null ? j.getMinSalary() <= maxSalary : true).collect(Collectors.toList());
        }

        // CompanyId
        if (companyId != null) {
            allJobs = allJobs.stream().filter(j -> Objects.equals(j.getCompanyId(), companyId)).collect(Collectors.toList());
        }

        // RecruiterId
        if (recruiterId != null) {
            allJobs = allJobs.stream().filter(j -> Objects.equals(j.getRecruiterId(), recruiterId)).collect(Collectors.toList());
        }

        // Sorting
        String sort = sortBy != null ? sortBy.toLowerCase() : "newest";
        if ("salary_high".equals(sort)) {
            allJobs.sort((a, b) -> Long.compare(
                    b.getMaxSalary() != null ? b.getMaxSalary() : (b.getMinSalary() != null ? b.getMinSalary() : 0L),
                    a.getMaxSalary() != null ? a.getMaxSalary() : (a.getMinSalary() != null ? a.getMinSalary() : 0L)
            ));
        } else if ("salary_low".equals(sort)) {
            allJobs.sort((a, b) -> Long.compare(
                    a.getMinSalary() != null ? a.getMinSalary() : 0L,
                    b.getMinSalary() != null ? b.getMinSalary() : 0L
            ));
        } else if ("views".equals(sort)) {
            allJobs.sort((a, b) -> Long.compare(b.getViewsCount() != null ? b.getViewsCount() : 0L, a.getViewsCount() != null ? a.getViewsCount() : 0L));
        } else {
            // newest
            allJobs.sort((a, b) -> {
                String d1 = b.getCreatedAt() != null ? b.getCreatedAt() : "";
                String d2 = a.getCreatedAt() != null ? a.getCreatedAt() : "";
                return d2.compareTo(d1);
            });
        }

        int p = page != null && page > 0 ? page : 1;
        int l = limit != null && limit > 0 ? limit : 10;
        int total = allJobs.size();
        int totalPages = (int) Math.ceil((double) total / l);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = Math.min((p - 1) * l, total);
        int toIndex = Math.min(fromIndex + l, total);
        List<Job> paginated = allJobs.subList(fromIndex, toIndex);

        List<JobResponse> responses = paginated.stream().map(this::mapToResponse).collect(Collectors.toList());

        return JobListResponse.builder()
                .jobs(responses)
                .total(total)
                .page(p)
                .limit(l)
                .totalPages(totalPages)
                .build();
    }

    @Transactional
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        job.setViewsCount((job.getViewsCount() != null ? job.getViewsCount() : 0L) + 1);
        jobRepository.save(job);

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse createJob(User recruiterUser, JobRequest request) {
        Long companyId = recruiterUser.getCompanyId();
        if (companyId == null) {
            List<Company> companies = companyRepository.findAll();
            if (!companies.isEmpty()) {
                companyId = companies.get(0).getId();
            }
        }

        Job job = Job.builder()
                .recruiterId(recruiterUser.getId())
                .companyId(companyId)
                .title(request.getTitle())
                .category(request.getCategory())
                .jobType(request.getJobType() != null ? request.getJobType() : "Full-time")
                .experienceLevel(request.getExperienceLevel())
                .workMode(request.getWorkMode())
                .location(request.getLocation() != null ? request.getLocation() : "Bengaluru")
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .description(request.getDescription())
                .responsibilities(request.getResponsibilities() != null ? request.getResponsibilities() : new ArrayList<>())
                .requirements(request.getRequirements() != null ? request.getRequirements() : new ArrayList<>())
                .perks(request.getPerks() != null ? request.getPerks() : new ArrayList<>())
                .skills(request.getSkills() != null ? request.getSkills() : new ArrayList<>())
                .status(request.getStatus() != null ? request.getStatus() : "OPEN")
                .featured(Boolean.TRUE.equals(request.getFeatured()))
                .deadline(request.getDeadline())
                .build();

        job = jobRepository.save(job);

        // Notify recruiter
        Notification notification = Notification.builder()
                .userId(recruiterUser.getId())
                .title("Job posted successfully")
                .body("Your job listing \"" + job.getTitle() + "\" is now active and accepting applicants.")
                .read(false)
                .build();
        notificationRepository.save(notification);

        return mapToResponse(job);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getCategory() != null) job.setCategory(request.getCategory());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getExperienceLevel() != null) job.setExperienceLevel(request.getExperienceLevel());
        if (request.getWorkMode() != null) job.setWorkMode(request.getWorkMode());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getMinSalary() != null) job.setMinSalary(request.getMinSalary());
        if (request.getMaxSalary() != null) job.setMaxSalary(request.getMaxSalary());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getResponsibilities() != null) job.setResponsibilities(request.getResponsibilities());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getPerks() != null) job.setPerks(request.getPerks());
        if (request.getSkills() != null) job.setSkills(request.getSkills());
        if (request.getStatus() != null) job.setStatus(request.getStatus());
        if (request.getFeatured() != null) job.setFeatured(request.getFeatured());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
    }

    public JobResponse mapToResponse(Job job) {
        Company company = null;
        if (job.getCompanyId() != null) {
            company = companyRepository.findById(job.getCompanyId()).orElse(null);
        }
        if (company == null) {
            company = Company.builder().name("Company").logoText("CP").location(job.getLocation()).build();
        }

        long applicantCount = applicationRepository.countByJobId(job.getId());

        User recruiter = null;
        if (job.getRecruiterId() != null) {
            recruiter = userRepository.findById(job.getRecruiterId()).orElse(null);
        }

        return JobResponse.builder()
                .id(job.getId())
                .recruiterId(job.getRecruiterId())
                .companyId(job.getCompanyId())
                .title(job.getTitle())
                .category(job.getCategory())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .workMode(job.getWorkMode())
                .location(job.getLocation())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .salaryPeriod(job.getSalaryPeriod())
                .openings(job.getOpenings())
                .status(job.getStatus())
                .featured(job.getFeatured())
                .viewsCount(job.getViewsCount())
                .deadline(job.getDeadline())
                .postedAt(job.getPostedAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .perks(job.getPerks())
                .skills(job.getSkills())
                .company(company)
                .applicantCount(applicantCount)
                .recruiter(recruiter)
                .build();
    }
}
