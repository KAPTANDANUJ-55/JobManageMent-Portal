package com.jobportal.controller;

import com.jobportal.dto.company.CompanyRequest;
import com.jobportal.dto.company.CompanyResponse;
import com.jobportal.entity.Company;
import com.jobportal.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/")
public class CompanyController {

    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

       @PostMapping("createCompany/")
    public ResponseEntity<?> registerCompany(@RequestBody CompanyRequest companyRequest, @RequestParam Long recruiterId) {
           return ResponseEntity.status(HttpStatus.CREATED).body(companyService.registerCompany(companyRequest, recruiterId));
    }

       public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        return ResponseEntity.ok(companyService.findAllCompanies());
       }


       @GetMapping("/{id}")
      public ResponseEntity<List<CompanyResponse>> getCompaniesById(@RequestParam Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
      }
      @DeleteMapping("/{id}")
      public ResponseEntity<?> deleteCompany(@RequestParam Long id, @RequestParam Long recruiterId) {
        return ResponseEntity.ok(companyService.deleteCompany(id, recruiterId));
      }

      @PutMapping("/{id}")
      public ResponseEntity<?> updateCompany(@RequestParam Long id, @RequestBody CompanyRequest companyRequest, @RequestParam Long recruiterId) {
              return ResponseEntity.ok(companyService.updateCompany(companyRequest, id, recruiterId));
      }



      @GetMapping("/skill")
    public ResponseEntity<List<CompanyResponse>> getCompaniesBySkill( @RequestParam String skill) {
        return ResponseEntity.ok(companyService.getBySkills(skill));
      }

}
