package com.jobportal.service;

import com.jobportal.dto.ApplicationResponse;
import com.jobportal.dto.ApplyRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.model.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final NotificationRepository notificationRepository;
    private final JobService jobService;

    @Transactional
    public ApplicationResponse apply(User user, ApplyRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        if (applicationRepository.findByJobIdAndUserId(job.getId(), user.getId()).isPresent()) {
            throw new RuntimeException("You have already applied for this position");
        }

        String now = Instant.now().toString();
        List<ApplicationHistory> historyList = new ArrayList<>();
        historyList.add(new ApplicationHistory("APPLIED", now, "Application submitted by candidate"));

        String resumeUrl = request.getResumeUrl() != null ? request.getResumeUrl() :
                (user.getResumeUrl() != null ? user.getResumeUrl() : "https://example.com/resume.pdf");
        String resumeName = request.getResumeName() != null ? request.getResumeName() :
                (user.getResumeName() != null ? user.getResumeName() : "Resume.pdf");

        Application application = Application.builder()
                .jobId(job.getId())
                .userId(user.getId())
                .status("APPLIED")
                .coverLetter(request.getCoverLetter() != null ? request.getCoverLetter() : "")
                .resumeUrl(resumeUrl)
                .resumeName(resumeName)
                .expectedCtc(request.getExpectedCtc())
                .noticePeriod(request.getNoticePeriod() != null ? request.getNoticePeriod() : "Immediate")
                .portfolioUrl(request.getPortfolioUrl() != null ? request.getPortfolioUrl() : user.getPortfolioUrl())
                .candidateName(request.getCandidateName() != null ? request.getCandidateName() : user.getName())
                .candidateEmail(request.getCandidateEmail() != null ? request.getCandidateEmail() : user.getEmail())
                .candidatePhone(request.getCandidatePhone() != null ? request.getCandidatePhone() : user.getPhone())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : String.valueOf(user.getExperienceYears()))
                .history(historyList)
                .build();

        application = applicationRepository.save(application);

        // Notify Recruiter
        if (job.getRecruiterId() != null) {
            notificationRepository.save(Notification.builder()
                    .userId(job.getRecruiterId())
                    .title("New Applicant Received")
                    .body(user.getName() + " applied for " + job.getTitle())
                    .read(false)
                    .build());
        }

        // Notify Seeker
        String compName = "Company";
        if (job.getCompanyId() != null) {
            Company c = companyRepository.findById(job.getCompanyId()).orElse(null);
            if (c != null) compName = c.getName();
        }

        notificationRepository.save(Notification.builder()
                .userId(user.getId())
                .title("Application Submitted")
                .body("You successfully applied for " + job.getTitle() + " at " + compName + ".")
                .read(false)
                .build());

        return mapToResponse(application);
    }

    public List<ApplicationResponse> getMyApplications(Long userId) {
        List<Application> apps = applicationRepository.findByUserId(userId);
        return apps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getJobApplicants(Long jobId) {
        List<Application> apps = applicationRepository.findByJobId(jobId);
        return apps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllRecruiterApplicants(Long recruiterId) {
        List<Job> recruiterJobs = jobRepository.findByRecruiterId(recruiterId);
        List<Long> jobIds = recruiterJobs.stream().map(Job::getId).collect(Collectors.toList());
        List<Application> apps = applicationRepository.findByJobIdIn(jobIds);
        return apps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, String newStatus, String note) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(newStatus);
        String now = Instant.now().toString();

        if (application.getHistory() == null) {
            application.setHistory(new ArrayList<>());
        }
        application.getHistory().add(new ApplicationHistory(
                newStatus,
                now,
                note != null && !note.isBlank() ? note : "Status updated to " + newStatus
        ));

        application = applicationRepository.save(application);

        // Notify candidate
        Job job = jobRepository.findById(application.getJobId()).orElse(null);
        String jobTitle = job != null ? job.getTitle() : "the position";

        notificationRepository.save(Notification.builder()
                .userId(application.getUserId())
                .title("Application Status Updated: " + newStatus)
                .body("Your application for " + jobTitle + " has moved to " + newStatus + ".")
                .read(false)
                .build());

        return mapToResponse(application);
    }

    @Transactional
    public void withdraw(Long userId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to withdraw this application");
        }

        application.setStatus("WITHDRAWN");
        String now = Instant.now().toString();

        if (application.getHistory() == null) {
            application.setHistory(new ArrayList<>());
        }
        application.getHistory().add(new ApplicationHistory(
                "WITHDRAWN",
                now,
                "Application withdrawn by candidate"
        ));

        applicationRepository.save(application);
    }

    public ApplicationResponse mapToResponse(Application app) {
        JobResponse jobResponse = null;
        if (app.getJobId() != null) {
            Job job = jobRepository.findById(app.getJobId()).orElse(null);
            if (job != null) {
                jobResponse = jobService.mapToResponse(job);
            }
        }

        User candidate = null;
        if (app.getUserId() != null) {
            candidate = userRepository.findById(app.getUserId()).orElse(null);
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJobId())
                .userId(app.getUserId())
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .resumeUrl(app.getResumeUrl())
                .resumeName(app.getResumeName())
                .expectedCtc(app.getExpectedCtc())
                .noticePeriod(app.getNoticePeriod())
                .portfolioUrl(app.getPortfolioUrl())
                .appliedAt(app.getAppliedAt())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .candidateName(app.getCandidateName() != null ? app.getCandidateName() : (candidate != null ? candidate.getName() : null))
                .candidateEmail(app.getCandidateEmail() != null ? app.getCandidateEmail() : (candidate != null ? candidate.getEmail() : null))
                .candidatePhone(app.getCandidatePhone() != null ? app.getCandidatePhone() : (candidate != null ? candidate.getPhone() : null))
                .experienceYears(app.getExperienceYears() != null ? app.getExperienceYears() : (candidate != null ? String.valueOf(candidate.getExperienceYears()) : null))
                .history(app.getHistory())
                .job(jobResponse)
                .candidate(candidate)
                .build();
    }
}
