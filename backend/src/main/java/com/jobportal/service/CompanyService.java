package com.jobportal.service;

import com.jobportal.dto.CompanyResponse;
import com.jobportal.dto.JobResponse;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;

    public List<CompanyResponse> getCompanies(String query, String industry, String location) {
        List<Company> companies = companyRepository.findAll();

        if (query != null && !query.isBlank()) {
            String q = query.toLowerCase();
            companies = companies.stream()
                    .filter(c -> (c.getName() != null && c.getName().toLowerCase().contains(q))
                            || (c.getAbout() != null && c.getAbout().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (industry != null && !industry.isBlank() && !"All".equalsIgnoreCase(industry)) {
            String ind = industry.toLowerCase();
            companies = companies.stream()
                    .filter(c -> c.getIndustry() != null && c.getIndustry().toLowerCase().contains(ind))
                    .collect(Collectors.toList());
        }

        if (location != null && !location.isBlank()) {
            String loc = location.toLowerCase();
            companies = companies.stream()
                    .filter(c -> c.getLocation() != null && c.getLocation().toLowerCase().contains(loc))
                    .collect(Collectors.toList());
        }

        return companies.stream().map(c -> {
            long openJobsCount = jobRepository.findByCompanyId(c.getId()).stream()
                    .filter(j -> "OPEN".equalsIgnoreCase(j.getStatus()))
                    .count();

            return CompanyResponse.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .logoText(c.getLogoText())
                    .industry(c.getIndustry())
                    .location(c.getLocation())
                    .size(c.getSize())
                    .website(c.getWebsite())
                    .about(c.getAbout())
                    .rating(c.getRating())
                    .openJobsCount(openJobsCount)
                    .build();
        }).collect(Collectors.toList());
    }

    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        List<Job> jobs = jobRepository.findByCompanyId(id);
        List<JobResponse> jobResponses = jobs.stream()
                .filter(j -> "OPEN".equalsIgnoreCase(j.getStatus()))
                .map(jobService::mapToResponse)
                .collect(Collectors.toList());

        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .logoText(company.getLogoText())
                .industry(company.getIndustry())
                .location(company.getLocation())
                .size(company.getSize())
                .website(company.getWebsite())
                .about(company.getAbout())
                .rating(company.getRating())
                .openJobsCount(jobResponses.size())
                .jobs(jobResponses)
                .build();
    }

    @Transactional
    public Company updateCompany(Long id, Company updates) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (updates.getName() != null) company.setName(updates.getName());
        if (updates.getLogoText() != null) company.setLogoText(updates.getLogoText());
        if (updates.getIndustry() != null) company.setIndustry(updates.getIndustry());
        if (updates.getLocation() != null) company.setLocation(updates.getLocation());
        if (updates.getSize() != null) company.setSize(updates.getSize());
        if (updates.getWebsite() != null) company.setWebsite(updates.getWebsite());
        if (updates.getAbout() != null) company.setAbout(updates.getAbout());
        if (updates.getRating() != null) company.setRating(updates.getRating());

        return companyRepository.save(company);
    }
}
