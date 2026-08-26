package com.jobportal.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UpdateUserProfileRequest {
    private String fullName;
    private String resumeUrl;
    private String skills;
}
