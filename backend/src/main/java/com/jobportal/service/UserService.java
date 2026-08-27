package com.jobportal.service;

import com.jobportal.dto.auth.Login;
import com.jobportal.dto.auth.Register;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
import java.util.Optional;
@Service
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }


    public ResponseEntity<?> registerUser(Register register) {
        Optional<User> findByEmail = userRepo.findByEmail(register.getEmail());
        if (findByEmail.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The User With This Email already exists");
        }
       String encodedPassword = passwordEncoder.encode(register.getPassword());
            User user = User.builder().password(encodedPassword).fullName(register.getUsername()).email(register.getEmail()).build();


        userRepo.save(user);


        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", user.getId(),
                "message", "Admin Registered Successfully"
        ));
    }
    public ResponseEntity<?> login(Login login) {

        Optional<User> existingUser = userRepo.findByEmail(login.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("USER NOT FOUND.PLEASE REGISTER");
        }

        User user =  existingUser.get();

        boolean matches = passwordEncoder.matches(
                login.getPassword(),
                user.getPassword()
        );
        if (!matches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "PASSWORD IS INCORRECT"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getFullName() != null ? user.getFullName() : "",
                "message", "LOGIN SUCCESSFULLY"
        ));
    }

}
