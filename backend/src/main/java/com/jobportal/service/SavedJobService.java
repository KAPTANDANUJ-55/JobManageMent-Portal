package com.jobportal.service;

import com.jobportal.dto.savedjob.savedJobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.entity.saveJob;
import com.jobportal.repository.JobRepo;
import com.jobportal.repository.SavedJobRepo;
import com.jobportal.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavedJobService {
    private final SavedJobRepo savedJobRepo;
    private final JobRepo  jobRepo;
    private final UserRepo userRepo;


    public SavedJobService(SavedJobRepo savedJobRepo, JobRepo jobRepo, UserRepo userRepo) {
        this.savedJobRepo = savedJobRepo;
        this.jobRepo = jobRepo;
        this.userRepo = userRepo;
    }

    public List<saveJob> findByUserId(Long userId) {
        return savedJobRepo.findByUserId(userId);
    }

    public List<saveJob> findByJobId(Long jobId) {
        return savedJobRepo.findByJobId(jobId);
    }

    public savedJobResponse saveJob(Long userId, Long jobId, Long savedJobId) {
        User user = userRepo.findById(userId).orElseThrow(()-> new RuntimeException("user not found"));

        Job job = jobRepo.findById(jobId).orElseThrow(()-> new RuntimeException("job not found"));

        saveJob saeJob = saveJob.builder()
                .user(user)
                .job(job)
                .savedAt(LocalDateTime.now())
                .build();


        return mapToResponse(savedJobRepo.save(saeJob));

    }

    private savedJobResponse mapToResponse(saveJob save)

    {

        return savedJobResponse.builder()
                .id(save.getId())
                .userId(save.getUser().getId())
                .jobId(save.getJob().getId())
                .jobTitle(save.getJob().getTitle())
                .jobLocation(save.getJob().getLocation())
                .savedAt(save.getSavedAt())
                .build();
    }


}
