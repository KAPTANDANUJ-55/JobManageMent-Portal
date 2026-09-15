package com.jobportal.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTrend {
    private String month;
    private long applications;
    private long postings;
    private long users;
}
