package com.jobportal.controller;

import com.jobportal.dto.auth.Login;
import com.jobportal.dto.auth.Register;
import com.jobportal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/get-all")
    public  ResponseEntity<?> getAllUsers(){
        return userService.getAllUsers();
    }
      @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return userService.login(login);
    }
         @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Register register) {
        return userService.registerUser(register);
    }
}
