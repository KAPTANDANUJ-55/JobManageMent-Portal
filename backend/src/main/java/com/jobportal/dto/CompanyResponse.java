package com.jobportal.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {
    private Long id;
    private String name;
    private String logoText;
    private String industry;
    private String location;
    private String size;
    private String website;
    private String about;
    private Double rating;
    private long openJobsCount;
    private List<JobResponse> jobs;
}
