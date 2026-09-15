package com.jobportal.service;

import com.jobportal.dto.UpdateProfileRequest;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User updateProfile(Long userId, UpdateProfileRequest updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getHeadline() != null) user.setHeadline(updates.getHeadline());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        if (updates.getLocation() != null) user.setLocation(updates.getLocation());
        if (updates.getBio() != null) user.setBio(updates.getBio());
        if (updates.getResumeUrl() != null) user.setResumeUrl(updates.getResumeUrl());
        if (updates.getResumeName() != null) user.setResumeName(updates.getResumeName());
        if (updates.getPortfolioUrl() != null) user.setPortfolioUrl(updates.getPortfolioUrl());
        if (updates.getGithubUrl() != null) user.setGithubUrl(updates.getGithubUrl());
        if (updates.getLinkedinUrl() != null) user.setLinkedinUrl(updates.getLinkedinUrl());
        if (updates.getSkills() != null) user.setSkills(updates.getSkills());
        if (updates.getExperienceYears() != null) user.setExperienceYears(updates.getExperienceYears());

        return userRepository.save(user);
    }

    public List<User> getUsers(String role, String search, Boolean active) {
        List<User> users = userRepository.findAll();

        if (role != null && !role.isBlank() && !"ALL".equalsIgnoreCase(role)) {
            users = users.stream()
                    .filter(u -> role.equalsIgnoreCase(u.getRole()))
                    .toList();
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(q))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)))
                    .toList();
        }

        if (active != null) {
            users = users.stream()
                    .filter(u -> Boolean.valueOf(active).equals(u.getActive()))
                    .toList();
        }

        return users;
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Cannot suspend an Administrator");
        }

        user.setActive(user.getActive() == null || !user.getActive());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Cannot delete an Administrator");
        }

        userRepository.delete(user);
    }
}
