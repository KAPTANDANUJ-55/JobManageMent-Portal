package com.jobportal.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String name;
    private String headline;
    private String phone;
    private String location;
    private String bio;
    private String resumeUrl;
    private String resumeName;
    private String portfolioUrl;
    private String githubUrl;
    private String linkedinUrl;
    private List<String> skills;
    private Integer experienceYears;
}
