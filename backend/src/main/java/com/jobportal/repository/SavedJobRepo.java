package com.jobportal.repository;

import com.jobportal.entity.saveJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SavedJobRepo extends JpaRepository<saveJob,Long> {
    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    List<saveJob> findByUserId(Long user_id);
    List<saveJob> findByJobId(Long job_id);


    void deleteByUserIdAndJobId(Long user_id, Long job_id);
}
