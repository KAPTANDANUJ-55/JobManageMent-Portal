package com.jobportal.dto.auth;
import lombok.*;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Login {

    private String password;
    private String email;
}
