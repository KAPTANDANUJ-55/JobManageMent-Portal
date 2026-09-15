package com.jobportal.service;

import com.jobportal.dto.JobResponse;
import com.jobportal.model.Job;
import com.jobportal.model.SavedJob;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;

    public List<JobResponse> getSavedJobs(Long userId) {
        List<SavedJob> savedList = savedJobRepository.findByUserId(userId);
        List<JobResponse> responses = new ArrayList<>();

        for (SavedJob saved : savedList) {
            Job job = jobRepository.findById(saved.getJobId()).orElse(null);
            if (job != null) {
                JobResponse resp = jobService.mapToResponse(job);
                resp.setSavedAt(saved.getSavedAt());
                responses.add(resp);
            }
        }
        return responses;
    }

    @Transactional
    public Map<String, Object> toggleSaveJob(Long userId, Long jobId) {
        Optional<SavedJob> existing = savedJobRepository.findByUserIdAndJobId(userId, jobId);
        Map<String, Object> result = new HashMap<>();
        result.put("jobId", jobId);

        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            result.put("isSaved", false);
            result.put("saved", false);
        } else {
            SavedJob savedJob = SavedJob.builder()
                    .userId(userId)
                    .jobId(jobId)
                    .build();
            savedJobRepository.save(savedJob);
            result.put("isSaved", true);
            result.put("saved", true);
        }
        return result;
    }

    public Map<String, Object> checkJobSaved(Long userId, Long jobId) {
        boolean isSaved = savedJobRepository.existsByUserIdAndJobId(userId, jobId);
        Map<String, Object> result = new HashMap<>();
        result.put("saved", isSaved);
        result.put("isSaved", isSaved);
        result.put("jobId", jobId);
        return result;
    }
}
