package com.jobportal.controller;

import com.jobportal.dto.CompanyResponse;
import com.jobportal.model.Company;
import com.jobportal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getCompanies(
            @RequestParam(required = false, name = "query") String query,
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "search") String search,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String location
    ) {
        String searchQuery = query != null ? query : (search != null ? search : q);
        return ResponseEntity.ok(companyService.getCompanies(searchQuery, industry, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company updates) {
        return ResponseEntity.ok(companyService.updateCompany(id, updates));
    }
}
