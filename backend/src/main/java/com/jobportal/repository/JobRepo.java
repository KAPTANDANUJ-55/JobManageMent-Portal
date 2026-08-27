package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepo extends JpaRepository<Job,Long> {
    List<Job> findByTitleIgnoreCase(String title);
    List<Job> findByPostedBy(String postedBy);
    List<Job>  findByCompanyId(long id);
    List<Job> findByRecruiterId(long id);
    List<Job> findByRequiredSkillsIgnoreCase(String skill);


}
