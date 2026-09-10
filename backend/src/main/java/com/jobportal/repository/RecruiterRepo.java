package com.jobportal.repository;

import com.jobportal.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterRepo extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByEmail(String email);
    Optional<Recruiter> findById(Long id);
}
