package com.jobportal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logoText;
    private String industry;
    private String location;
    private String size;
    private String website;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Builder.Default
    private Double rating = 4.5;
}
