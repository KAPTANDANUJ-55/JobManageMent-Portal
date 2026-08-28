package com.jobportal.dto.company;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CompanyResponse {
    private Long id;
    private String name;
    private String companyEmail;
    private String description;
    private String location;
    private String skills;
    private String website;
    private Long recruiterId;
    private String recruiterName;
}