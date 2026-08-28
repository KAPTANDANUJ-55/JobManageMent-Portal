package com.jobportal.repository;

import com.jobportal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepo extends JpaRepository<Company,Long> {
    Optional<Company> findById(Long companyId);
    Optional<Company> findByCompanyname(String companyname);
    boolean existsByCompanyname(String companyname);

    List<Company> findAllByRecruiterId(Long recruiterId);

}
