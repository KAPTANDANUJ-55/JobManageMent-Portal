package com.jobportal.repository;

import com.jobportal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompanyRepo extends JpaRepository<Company,Long> {
    Optional<Company> findById(Long companyId);
    Optional<Company> findByCompanyname(String companyname);
    boolean existsByCompanyname(String companyname);

    List<Company> findByRecruiterId(Long recruiterId);
    @Query("SELECT DISTINCT j.company FROM Job j WHERE LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%')) AND j.active = true")
    List<Company> findCompaniesByRequiredSkill(@Param("skill") String skills);

}
