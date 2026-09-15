package com.jobportal.controller;

import com.jobportal.config.DataInitializer;
import com.jobportal.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
public class SystemController {

    private final DataInitializer dataInitializer;

    @PostMapping("/reset-demo")
    public ResponseEntity<ApiResponse> resetDemo() {
        dataInitializer.resetAndSeed();
        return ResponseEntity.ok(new ApiResponse(true, "Mock database reset to original seed data"));
    }
}
