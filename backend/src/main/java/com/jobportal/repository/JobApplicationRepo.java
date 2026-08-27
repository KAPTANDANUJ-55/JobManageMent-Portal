package com.jobportal.repository;

import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantId(Long applicantId);
    List<JobApplication> findByJobId(Long jobId);
    Optional<JobApplication> findByApplicantIdAndJobId(Long applicantId, Long jobId);
    boolean existsByApplicantIdAndJobId(Long applicantId, Long jobId);
}