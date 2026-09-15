package com.jobportal.service;

import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.Company;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("Your account has been suspended. Please contact support.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("An account with this email already exists");
        }

        String role = request.getRole() != null ? request.getRole() : "JOB_SEEKER";
        Long companyId = null;

        if ("RECRUITER".equalsIgnoreCase(role) && request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            String cName = request.getCompanyName().trim();
            Company company = companyRepository.findByNameIgnoreCase(cName)
                    .orElseGet(() -> {
                        String logo = cName.length() >= 2 ? cName.substring(0, 2).toUpperCase() : cName.toUpperCase();
                        Company newComp = Company.builder()
                                .name(cName)
                                .logoText(logo)
                                .industry("Technology")
                                .location("Bengaluru")
                                .size("10-50 employees")
                                .website("https://" + cName.toLowerCase().replaceAll("\\s+", "") + ".com")
                                .about(cName + " is hiring top talent on JobHub.")
                                .rating(4.5)
                                .build();
                        return companyRepository.save(newComp);
                    });
            companyId = company.getId();
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .location("Bengaluru")
                .headline(request.getHeadline() != null ? request.getHeadline() : 
                        ("RECRUITER".equalsIgnoreCase(role) ? "Recruiter at " + (request.getCompanyName() != null ? request.getCompanyName() : "Company") : "Aspiring Professional"))
                .bio("")
                .skills(new ArrayList<>())
                .experienceYears(1)
                .companyId(companyId)
                .active(true)
                .build();

        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(user)
                .build();
    }

    public User getMe(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
