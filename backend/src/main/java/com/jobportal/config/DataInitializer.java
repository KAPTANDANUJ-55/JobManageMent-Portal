package com.jobportal.config;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "Password@123";

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            resetAndSeed();
        }
    }

    @Transactional
    public void resetAndSeed() {
        notificationRepository.deleteAll();
        savedJobRepository.deleteAll();
        applicationRepository.deleteAll();
        jobRepository.deleteAll();
        userRepository.deleteAll();
        companyRepository.deleteAll();

        String encodedPassword = passwordEncoder.encode(DEFAULT_PASSWORD);
        Instant now = Instant.now();

        // 1. Companies
        Company zenlytics = companyRepository.save(Company.builder()
                .name("Zenlytics").logoText("ZL").industry("Analytics SaaS").location("Bengaluru")
                .size("250-500 employees").website("https://zenlytics.in")
                .about("Zenlytics builds a self-serve product analytics platform used by more than 900 Indian SaaS and D2C teams.")
                .rating(4.4).build());

        Company nimbusPay = companyRepository.save(Company.builder()
                .name("NimbusPay").logoText("NP").industry("Fintech & Payments").location("Mumbai")
                .size("500-1000 employees").website("https://nimbuspay.com")
                .about("NimbusPay is an RBI-licensed payment aggregator processing UPI, cards and recurring mandates for marketplaces and lending platforms.")
                .rating(4.1).build());

        Company craftly = companyRepository.save(Company.builder()
                .name("Craftly Labs").logoText("CL").industry("Design & Product Studio").location("Pune")
                .size("50-100 employees").website("https://craftlylabs.design")
                .about("Craftly Labs is an independent product studio that partners with funded startups on research, interface design and design systems.")
                .rating(4.6).build());

        Company vahan = companyRepository.save(Company.builder()
                .name("Vahan Mobility").logoText("VM").industry("Mobility & Logistics").location("Gurugram")
                .size("1000-5000 employees").website("https://vahanmobility.in")
                .about("Vahan Mobility runs an electric two-wheeler fleet and last-mile delivery network across eleven cities.")
                .rating(3.9).build());

        Company medha = companyRepository.save(Company.builder()
                .name("MedhaAI").logoText("MA").industry("Healthcare AI").location("Hyderabad")
                .size("100-250 employees").website("https://medha.ai")
                .about("MedhaAI develops clinical decision-support models for radiology and pathology.")
                .rating(4.3).build());

        Company kaveri = companyRepository.save(Company.builder()
                .name("Kaveri Cloud").logoText("KC").industry("Cloud Infrastructure").location("Chennai")
                .size("250-500 employees").website("https://kavericloud.com")
                .about("Kaveri Cloud offers managed Kubernetes, object storage and observability out of data centres in Chennai and Mumbai.")
                .rating(4.0).build());

        Company trailhead = companyRepository.save(Company.builder()
                .name("Trailhead Retail").logoText("TR").industry("E-commerce").location("Noida")
                .size("500-1000 employees").website("https://trailheadretail.in")
                .about("Trailhead Retail sells outdoor and adventure gear through its storefront and 8 experience stores.")
                .rating(3.8).build());

        Company brightfold = companyRepository.save(Company.builder()
                .name("BrightFold Media").logoText("BF").industry("Marketing & AdTech").location("Mumbai")
                .size("100-250 employees").website("https://brightfold.media")
                .about("BrightFold Media plans and buys performance media for consumer brands.")
                .rating(4.2).build());

        Company finedge = companyRepository.save(Company.builder()
                .name("FinEdge Capital").logoText("FE").industry("Financial Services").location("Bengaluru")
                .size("1000-5000 employees").website("https://finedgecapital.in")
                .about("FinEdge Capital is a non-banking financial company lending to small businesses and salaried borrowers.")
                .rating(3.7).build());

        Company orbit = companyRepository.save(Company.builder()
                .name("Orbit HR Tech").logoText("OH").industry("HR Software").location("Remote")
                .size("50-100 employees").website("https://orbithr.io")
                .about("Orbit HR Tech is a fully distributed team building payroll and attendance software for Indian SMBs.")
                .rating(4.5).build());

        // 2. Users
        User admin = userRepository.save(User.builder()
                .name("Admin User").email("admin@demo.com").password(encodedPassword).role("ADMIN")
                .phone("+91 98450 11001").location("Bengaluru")
                .headline("Platform administrator at JobHub")
                .bio("Keeps job postings honest, reviews recruiter accounts and watches the moderation queue.")
                .skills(List.of("Platform Administration", "Security", "Operations"))
                .experienceYears(8).active(true).build());

        User recruiter1 = userRepository.save(User.builder()
                .name("Meera Nair").email("recruiter@demo.com").password(encodedPassword).role("RECRUITER")
                .companyId(zenlytics.getId()).phone("+91 98450 22013").location("Bengaluru")
                .headline("Talent Partner, Engineering & Design at Zenlytics")
                .bio("Hires for the product pods at Zenlytics. Replies to every application.")
                .skills(List.of("Technical Recruiting", "Talent Acquisition", "Sourcing"))
                .experienceYears(7).active(true).build());

        User recruiter2 = userRepository.save(User.builder()
                .name("Rohit Deshpande").email("rohit.deshpande@nimbuspay.com").password(encodedPassword).role("RECRUITER")
                .companyId(nimbusPay.getId()).phone("+91 98200 44521").location("Mumbai")
                .headline("Lead Recruiter, Technology at NimbusPay")
                .bio("Ten years of hiring for payments and risk teams across Mumbai and Pune.")
                .skills(List.of("Fintech Recruiting", "Leadership Hiring"))
                .experienceYears(10).active(true).build());

        User recruiter3 = userRepository.save(User.builder()
                .name("Ishita Bose").email("ishita@craftlylabs.design").password(encodedPassword).role("RECRUITER")
                .companyId(craftly.getId()).phone("+91 90280 71144").location("Pune")
                .headline("Studio Manager at Craftly Labs")
                .skills(List.of("Design Recruitment", "Portfolio Review"))
                .experienceYears(6).active(true).build());

        User recruiter4 = userRepository.save(User.builder()
                .name("Naveen Chandra").email("naveen.chandra@vahanmobility.in").password(encodedPassword).role("RECRUITER")
                .companyId(vahan.getId()).phone("+91 99100 63302").location("Gurugram")
                .headline("Talent Acquisition Manager at Vahan Mobility")
                .skills(List.of("Operations Hiring", "Engineering Recruitment"))
                .experienceYears(8).active(true).build());

        User seeker1 = userRepository.save(User.builder()
                .name("Arsh Sharma").email("seeker@demo.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 96860 33417").location("Bengaluru")
                .headline("Frontend Engineer - React, TypeScript, design systems")
                .bio("Three years of building customer-facing dashboards and design systems. Most recently rebuilt a reporting suite that cut first render from 4.2s to 900ms.")
                .skills(new ArrayList<>(List.of("React", "JavaScript", "TypeScript", "Tailwind CSS", "Redux Toolkit", "REST APIs", "Jest")))
                .experienceYears(3)
                .resumeName("Arsh-Sharma-Frontend-Engineer.pdf")
                .resumeUrl("https://example.com/resumes/arsh-sharma.pdf")
                .portfolioUrl("https://portfolio.dev")
                .githubUrl("https://github.com/arsh")
                .linkedinUrl("https://linkedin.com/in/arsh")
                .active(true).build());

        // Alias for arsh@demo.com
        userRepository.save(User.builder()
                .name("Arsh Sharma").email("arsh@demo.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 96860 33417").location("Bengaluru")
                .headline("Frontend Engineer - React, TypeScript, design systems")
                .bio("Three years of building customer-facing dashboards and design systems.")
                .skills(new ArrayList<>(List.of("React", "JavaScript", "TypeScript", "Tailwind CSS", "Redux Toolkit", "REST APIs", "Jest")))
                .experienceYears(3)
                .resumeName("Arsh-Sharma-Frontend-Engineer.pdf")
                .resumeUrl("https://example.com/resumes/arsh-sharma.pdf")
                .portfolioUrl("https://portfolio.dev")
                .githubUrl("https://github.com/arsh")
                .linkedinUrl("https://linkedin.com/in/arsh")
                .active(true).build());

        User seeker2 = userRepository.save(User.builder()
                .name("Priya Menon").email("priya.menon@example.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 98840 77120").location("Chennai")
                .headline("Data Analyst - SQL, Python, dashboards that get used")
                .bio("Two years turning messy operations data into weekly decisions for a logistics team.")
                .skills(new ArrayList<>(List.of("SQL", "Python", "Pandas", "Power BI", "Excel", "dbt")))
                .experienceYears(2)
                .resumeName("Priya-Menon-Analyst.pdf")
                .resumeUrl("https://example.com/resumes/priya-menon.pdf")
                .active(true).build());

        User seeker3 = userRepository.save(User.builder()
                .name("Karthik Reddy").email("karthik.reddy@example.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 90000 51284").location("Hyderabad")
                .headline("Backend Engineer - Java, Spring Boot, distributed systems")
                .bio("Five years on payment and settlement services handling roughly 4,000 requests per second at peak.")
                .skills(new ArrayList<>(List.of("Java", "Spring Boot", "PostgreSQL", "Kafka", "Docker", "AWS")))
                .experienceYears(5)
                .resumeName("Karthik-Reddy-Backend.pdf")
                .resumeUrl("https://example.com/resumes/karthik-reddy.pdf")
                .active(true).build());

        User seeker4 = userRepository.save(User.builder()
                .name("Sneha Gupta").email("sneha.gupta@example.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 98110 60934").location("Noida")
                .headline("Product Designer - research-led, systems-minded")
                .bio("Four years designing for fintech and health apps.")
                .skills(new ArrayList<>(List.of("Figma", "User Research", "Prototyping", "Design Systems", "Accessibility")))
                .experienceYears(4)
                .resumeName("Sneha-Gupta-Product-Designer.pdf")
                .resumeUrl("https://example.com/resumes/sneha-gupta.pdf")
                .active(true).build());

        User seeker5 = userRepository.save(User.builder()
                .name("Aditya Rao").email("aditya.rao@example.com").password(encodedPassword).role("JOB_SEEKER")
                .phone("+91 88880 41276").location("Pune")
                .headline("Final-year CS student looking for a first engineering role")
                .skills(new ArrayList<>(List.of("JavaScript", "Node.js", "MongoDB", "Git", "HTML/CSS")))
                .experienceYears(0)
                .resumeName("Aditya-Rao-Fresher.pdf")
                .resumeUrl("https://example.com/resumes/aditya-rao.pdf")
                .active(true).build());

        // 3. Jobs
        List<String> zenBenefits = List.of(
                "Employee stock options with an annual refresh grant",
                "Group medical cover of Rs 10L for you, your partner and two dependents",
                "Annual learning wallet of Rs 60,000 for courses and conferences",
                "Two no-questions-asked wellness days every quarter"
        );

        List<String> nimbusBenefits = List.of(
                "Performance bonus paid out twice a year",
                "Family floater health insurance of Rs 15L plus term cover",
                "Certification reimbursement for AWS, CFA and FRM",
                "Creche allowance and a 26-week parental leave policy"
        );

        Job job1 = jobRepository.save(Job.builder()
                .title("Senior Frontend Engineer").companyId(zenlytics.getId()).recruiterId(recruiter1.getId())
                .category("Engineering").jobType("Full-time").workMode("Hybrid").location("Bengaluru")
                .experienceLevel("Senior").minSalary(2800000L).maxSalary(4200000L).openings(2)
                .featured(true).viewsCount(1486L)
                .postedAt(now.minus(24, ChronoUnit.DAYS).toString())
                .deadline(now.plus(26, ChronoUnit.DAYS).toString())
                .description("Zenlytics dashboards are the first thing our customers open in the morning. We are looking for a senior frontend engineer to own the charting and exploration surface.\n\nYou will work in a pod of five - two backend engineers, a designer and a product manager - with real say over what gets built and in what order.\n\nOur stack is React 18, Vite, Tailwind and TanStack Query against a Java backend.")
                .responsibilities(List.of(
                        "Own the query builder and dashboard rendering surface end to end",
                        "Cut time-to-interactive on large accounts through virtualisation and memoisation",
                        "Extend the shared component library and keep its documentation current",
                        "Review pull requests from mid-level engineers and mentor them"
                ))
                .requirements(List.of(
                        "5+ years building production React applications",
                        "Strong grasp of browser rendering path and React reconciliation",
                        "Experience designing reusable component APIs",
                        "Comfortable with TypeScript and modern build tooling"
                ))
                .skills(List.of("React", "TypeScript", "Tailwind CSS", "Data Visualisation", "Performance"))
                .perks(zenBenefits)
                .status("OPEN").build());

        Job job2 = jobRepository.save(Job.builder()
                .title("Analytics Engineer").companyId(zenlytics.getId()).recruiterId(recruiter1.getId())
                .category("Data & Analytics").jobType("Remote").workMode("Remote").location("Remote")
                .experienceLevel("Mid-level").minSalary(1800000L).maxSalary(2600000L).openings(1)
                .featured(false).viewsCount(742L)
                .postedAt(now.minus(11, ChronoUnit.DAYS).toString())
                .deadline(now.plus(19, ChronoUnit.DAYS).toString())
                .description("We are hiring an analytics engineer to sit between our data platform and the teams that depend on it. You will build and own the modelled layer in dbt - staging, marts and a documented metrics catalogue.")
                .responsibilities(List.of(
                        "Design and maintain dbt models covering product usage and billing",
                        "Publish a metrics catalogue with freshness guarantees",
                        "Build data-quality tests and alerting"
                ))
                .requirements(List.of(
                        "3+ years in analytics engineering or data engineering",
                        "Advanced SQL and query optimization",
                        "Hands-on dbt experience with production models"
                ))
                .skills(List.of("SQL", "dbt", "Python", "Snowflake", "Data Modelling"))
                .perks(zenBenefits)
                .status("OPEN").build());

        Job job3 = jobRepository.save(Job.builder()
                .title("Product Designer").companyId(zenlytics.getId()).recruiterId(recruiter1.getId())
                .category("Design").jobType("Full-time").workMode("Hybrid").location("Bengaluru")
                .experienceLevel("Mid-level").minSalary(1600000L).maxSalary(2400000L).openings(1)
                .featured(false).viewsCount(908L)
                .postedAt(now.minus(18, ChronoUnit.DAYS).toString())
                .deadline(now.plus(12, ChronoUnit.DAYS).toString())
                .description("Analytics products fail when they show everything and explain nothing. We want a product designer who is genuinely interested in designing dense, fast interfaces.")
                .responsibilities(List.of(
                        "Design onboarding and dashboard-creation flows",
                        "Run customer conversations and usability studies",
                        "Extend Figma components in tandem with engineering"
                ))
                .requirements(List.of(
                        "3+ years designing web applications",
                        "Strong Figma craft including components and auto layout",
                        "Practical understanding of accessibility and contrast"
                ))
                .skills(List.of("Figma", "Interaction Design", "User Research", "Design Systems"))
                .perks(zenBenefits)
                .status("OPEN").build());

        Job job4 = jobRepository.save(Job.builder()
                .title("Backend Engineer - Java & Spring Boot").companyId(nimbusPay.getId()).recruiterId(recruiter2.getId())
                .category("Engineering").jobType("Full-time").workMode("On-site").location("Mumbai")
                .experienceLevel("Mid-level").minSalary(1800000L).maxSalary(2800000L).openings(3)
                .featured(true).viewsCount(2214L)
                .postedAt(now.minus(19, ChronoUnit.DAYS).toString())
                .deadline(now.plus(28, ChronoUnit.DAYS).toString())
                .description("NimbusPay settles money for thousands of merchants daily. You will join the settlements team working on reconciliation, bank API integrations, idempotency, retries and high throughput Kafka pipelines.")
                .responsibilities(List.of(
                        "Build and operate settlement and payout services in Java and Spring Boot",
                        "Design idempotent APIs and event consumers in Kafka",
                        "Write SQL migrations and perform schema optimizations"
                ))
                .requirements(List.of(
                        "3-6 years backend engineering with Java and Spring Boot",
                        "Solid relational database indexing and transaction skills",
                        "Experience with Kafka or RabbitMQ"
                ))
                .skills(List.of("Java", "Spring Boot", "PostgreSQL", "Kafka", "Kubernetes", "REST APIs"))
                .perks(nimbusBenefits)
                .status("OPEN").build());

        Job job5 = jobRepository.save(Job.builder()
                .title("Product Manager - Payments").companyId(nimbusPay.getId()).recruiterId(recruiter2.getId())
                .category("Product").jobType("Full-time").workMode("Hybrid").location("Mumbai")
                .experienceLevel("Senior").minSalary(3200000L).maxSalary(4500000L).openings(1)
                .featured(true).viewsCount(1702L)
                .postedAt(now.minus(7, ChronoUnit.DAYS).toString())
                .deadline(now.plus(23, ChronoUnit.DAYS).toString())
                .description("We are looking for a product manager to own the merchant-facing side of recurring payments: mandates, retries, dunning and reporting.")
                .responsibilities(List.of(
                        "Own recurring payments roadmap and mandate success rates",
                        "Turn failure telemetry into clear engineering priorities",
                        "Conduct merchant discovery sessions"
                ))
                .requirements(List.of(
                        "4+ years in product management (at least 2 in fintech/payments)",
                        "Solid understanding of UPI Autopay and eNACH",
                        "Data-driven mindset with SQL proficiency"
                ))
                .skills(List.of("Product Management", "Payments", "API Design", "SQL", "Roadmapping"))
                .perks(nimbusBenefits)
                .status("OPEN").build());

        Job job6 = jobRepository.save(Job.builder()
                .title("UI/UX Design Intern").companyId(craftly.getId()).recruiterId(recruiter3.getId())
                .category("Design").jobType("Internship").workMode("On-site").location("Pune")
                .experienceLevel("Fresher").minSalary(300000L).maxSalary(420000L).openings(2)
                .featured(false).viewsCount(1975L)
                .postedAt(now.minus(6, ChronoUnit.DAYS).toString())
                .deadline(now.plus(24, ChronoUnit.DAYS).toString())
                .description("A six-month paid internship at the studio with a genuine chance of a full-time offer. You will be paired with a senior designer on live client work.")
                .responsibilities(List.of(
                        "Support senior designers with wireframes and component states",
                        "Build and maintain Figma component libraries",
                        "Run competitive teardowns and user observation notes"
                ))
                .requirements(List.of(
                        "Recent graduate or final-year student in design or HCI",
                        "Portfolio showing creative process and typography sense",
                        "Working knowledge of Figma"
                ))
                .skills(List.of("Figma", "Wireframing", "Visual Design", "Design Thinking"))
                .perks(List.of("Hardware budget", "Mentorship", "Studio trips"))
                .status("OPEN").build());

        Job job7 = jobRepository.save(Job.builder()
                .title("Android Engineer").companyId(vahan.getId()).recruiterId(recruiter4.getId())
                .category("Engineering").jobType("Full-time").workMode("Hybrid").location("Gurugram")
                .experienceLevel("Mid-level").minSalary(1700000L).maxSalary(2500000L).openings(2)
                .featured(false).viewsCount(1094L)
                .postedAt(now.minus(5, ChronoUnit.DAYS).toString())
                .deadline(now.plus(25, ChronoUnit.DAYS).toString())
                .description("Nine thousand riders open the Vahan app before every shift. We build offline-first rider apps with battery swap station routing and telemetry.")
                .responsibilities(List.of(
                        "Build robust offline-first Android apps using Jetpack Compose and Room",
                        "Optimize battery consumption and GPS pinging intervals",
                        "Implement Bluetooth Low Energy communication with smart batteries"
                ))
                .requirements(List.of(
                        "3+ years of Android development with Kotlin",
                        "Experience with offline storage, background workers and Room",
                        "Solid understanding of Coroutines and Flow"
                ))
                .skills(List.of("Android", "Kotlin", "Jetpack Compose", "Coroutines", "Room"))
                .perks(List.of("EV fleet access", "Health cover of Rs 8L", "Performance bonus"))
                .status("OPEN").build());

        // 4. Applications
        List<ApplicationHistory> app1History = new ArrayList<>();
        app1History.add(new ApplicationHistory("APPLIED", now.minus(5, ChronoUnit.DAYS).toString(), "Application submitted by candidate"));
        app1History.add(new ApplicationHistory("IN_REVIEW", now.minus(3, ChronoUnit.DAYS).toString(), "Profile reviewed by Meera Nair"));

        applicationRepository.save(Application.builder()
                .jobId(job1.getId())
                .userId(seeker1.getId())
                .status("IN_REVIEW")
                .coverLetter("I am excited to apply for the Senior Frontend Engineer role at Zenlytics. I have 3+ years experience optimizing React applications and designing scalable component libraries.")
                .resumeUrl(seeker1.getResumeUrl())
                .resumeName(seeker1.getResumeName())
                .expectedCtc("32 LPA")
                .noticePeriod("15 Days")
                .portfolioUrl(seeker1.getPortfolioUrl())
                .candidateName(seeker1.getName())
                .candidateEmail(seeker1.getEmail())
                .candidatePhone(seeker1.getPhone())
                .experienceYears(String.valueOf(seeker1.getExperienceYears()))
                .history(app1History)
                .appliedAt(now.minus(5, ChronoUnit.DAYS).toString())
                .build());

        List<ApplicationHistory> app2History = new ArrayList<>();
        app2History.add(new ApplicationHistory("APPLIED", now.minus(2, ChronoUnit.DAYS).toString(), "Application submitted by candidate"));

        applicationRepository.save(Application.builder()
                .jobId(job4.getId())
                .userId(seeker3.getId())
                .status("APPLIED")
                .coverLetter("With 5 years of experience in Java, Spring Boot, and Kafka, I would love to contribute to NimbusPay's high-scale settlements engine.")
                .resumeUrl(seeker3.getResumeUrl())
                .resumeName(seeker3.getResumeName())
                .expectedCtc("26 LPA")
                .noticePeriod("1 Month")
                .candidateName(seeker3.getName())
                .candidateEmail(seeker3.getEmail())
                .candidatePhone(seeker3.getPhone())
                .experienceYears(String.valueOf(seeker3.getExperienceYears()))
                .history(app2History)
                .appliedAt(now.minus(2, ChronoUnit.DAYS).toString())
                .build());

        // 5. Saved Jobs
        savedJobRepository.save(SavedJob.builder()
                .userId(seeker1.getId())
                .jobId(job4.getId())
                .savedAt(now.minus(1, ChronoUnit.DAYS).toString())
                .build());

        savedJobRepository.save(SavedJob.builder()
                .userId(seeker1.getId())
                .jobId(job5.getId())
                .savedAt(now.minus(2, ChronoUnit.DAYS).toString())
                .build());

        // 6. Notifications
        notificationRepository.save(Notification.builder()
                .userId(seeker1.getId())
                .title("Application Under Review")
                .body("Your application for Senior Frontend Engineer at Zenlytics is now in review.")
                .read(false)
                .createdAt(now.minus(3, ChronoUnit.DAYS).toString())
                .build());

        notificationRepository.save(Notification.builder()
                .userId(recruiter1.getId())
                .title("New Applicant Received")
                .body("Arsh Sharma applied for Senior Frontend Engineer.")
                .read(true)
                .createdAt(now.minus(5, ChronoUnit.DAYS).toString())
                .build());
    }
}
