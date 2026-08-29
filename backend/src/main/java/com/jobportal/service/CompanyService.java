package com.jobportal.service;

import com.jobportal.dto.company.CompanyRequest;
import com.jobportal.dto.company.CompanyResponse;
import com.jobportal.dto.job.JobResponse;
import com.jobportal.entity.Company;
import com.jobportal.entity.User;
import com.jobportal.repository.CompanyRepo;
import com.jobportal.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyService {
     private final CompanyRepo companyRepo;
     private final UserRepo userRepo;

    public CompanyService(CompanyRepo companyRepo, UserRepo userRepo) {
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
    }

    public CompanyResponse registerCompany(CompanyRequest request, Long recruiterId) {
        if (companyRepo.existsByCompanyname(request.getName())){
            throw new RuntimeException("Company with name '" + request.getName() + "' already exists!");
        }

        User recruiter = userRepo.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found with ID: " + recruiterId));

         Company company = Company.builder().Companyname(request.getName()).companyEmail(request.getCompanyEmail()).recruiter(recruiter).website(request.getWebsite()).location(request.getLocation()).description(request.getDescription()).companyid(request.getCompanyId()).build();
         

        Company savedCompany = companyRepo.save(company);
        return mapToResponse(savedCompany);
    }

 public CompanyResponse updateCompany(CompanyRequest request, Long recruiterId,Long companyId) {
       Company company = companyRepo.findById(companyId).orElseThrow(() -> new RuntimeException("Company with ID: " + companyId + " not found!"));
     if (!company.getRecruiter().getId().equals(recruiterId)) {
         throw new RuntimeException("Unauthorized: You do not own this company profile");
     }
       company.setCompanyname(request.getName());

       company.setCompanyEmail(request.getCompanyEmail());

       company.setWebsite(request.getWebsite());
       company.setLocation(request.getLocation());
       company.setDescription(request.getDescription());
       Company savedCompany = companyRepo.save(company);

       return mapToResponse(savedCompany);

 }

 public List<CompanyResponse> findAllCompanies() {
        return companyRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
 }
 public  CompanyResponse getCompanyById(Long companyId) {
        Company company = companyRepo.findById(companyId).orElseThrow(() -> new RuntimeException("Company with ID: " + companyId + " not found!"));

        return mapToResponse(company);
 }

 public CompanyResponse deleteCompany(Long companyId,Long recruiterId) {
        Company company = companyRepo.findById(companyId).orElseThrow(() -> new RuntimeException("Company with ID: " + companyId + " not found!"));
     if (!company.getRecruiter().getId().equals(recruiterId)) {
         throw new RuntimeException("Unauthorized: You cannot delete this company profile");
     }
        companyRepo.delete(company);

     return mapToResponse(company);
 }
    private CompanyResponse mapToResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getCompanyid())
                .name(company.getCompanyname())
                .description(company.getDescription())
                .location(company.getLocation())
                .website(company.getWebsite())
                .recruiterId(company.getRecruiter().getId())
                .recruiterName(company.getRecruiter().getFullName())
                .build();
    }

    private List<CompanyResponse> getBySkills(String skills) {
        List<Company> company = companyRepo.findCompaniesByRequiredSkill(skills);
        if (skills == null || skills.trim().isEmpty() || !company.equals(skills)) {
            throw new RuntimeException("Skill keyword cannot be empty");
        }
        return company.stream().map(this::mapToResponse).collect(Collectors.toList());
    }
}
