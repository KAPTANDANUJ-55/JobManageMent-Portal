package com.jobportal.dto.company;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;
    @Column(unique = true)
    private String companyEmail;
    private String description;
    private String location;
    private String website;
}