package com.jobportal.controller;

import com.jobportal.service.JobService;

public class JobController {
    private JobService jobService;
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }


}
