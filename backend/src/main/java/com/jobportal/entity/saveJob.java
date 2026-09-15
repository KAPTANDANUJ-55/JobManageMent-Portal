package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "saved_jobs",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id","job_id"})
})
public class saveJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "job_id")
    private Job job;

@Builder.Default
   private LocalDateTime savedAt = LocalDateTime.now();
}
