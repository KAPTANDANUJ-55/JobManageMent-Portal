package com.jobportal.dto.auth;
import com.jobportal.entity.Role;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
    public class Register {
        private String username;
        private String password;
        private String email;
        private Role role;
    }
