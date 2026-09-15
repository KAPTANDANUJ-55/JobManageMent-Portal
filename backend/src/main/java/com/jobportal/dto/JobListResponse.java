package com.jobportal.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobListResponse {
    private List<JobResponse> jobs;
    private long total;
    private int page;
    private int limit;
    private int totalPages;
}
