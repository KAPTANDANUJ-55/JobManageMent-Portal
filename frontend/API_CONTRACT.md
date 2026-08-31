# JobHub API Contract (Frontend ↔ Spring Boot Backend)

This document specifies the exact REST API contract that the frontend expects. To integrate with the Java / Spring Boot backend, implement these endpoints and set `VITE_USE_MOCKS=false` in `frontend/.env`.

---

## Base URL & Authentication

- **Base URL**: `/api` (proxied in Vite to `http://localhost:8080` in dev).
- **Authentication**: JWT Bearer Token in `Authorization: Bearer <token>` header for all protected endpoints.

---

## 1. Authentication & Users

### `POST /api/auth/login`
Authenticates a user and returns a JWT token.
- **Request Body**:
```json
{
  "email": "arsh@demo.com",
  "password": "Password@123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Arsh Sharma",
    "email": "arsh@demo.com",
    "role": "JOB_SEEKER",
    "headline": "Senior Frontend Engineer",
    "location": "Bengaluru, India",
    "resumeUrl": "https://drive.google.com/...",
    "skills": ["React", "JavaScript", "Tailwind CSS"],
    "active": true
  }
}
```

---

### `POST /api/auth/register`
Registers a new Job Seeker or Recruiter account.
- **Request Body**:
```json
{
  "name": "Priya Sharma",
  "email": "priya@zenlytics.in",
  "password": "Password@123",
  "role": "RECRUITER",
  "companyName": "Zenlytics"
}
```
- **Response `201 Created`**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 2,
    "name": "Priya Sharma",
    "email": "priya@zenlytics.in",
    "role": "RECRUITER",
    "companyId": 1,
    "companyName": "Zenlytics",
    "active": true
  }
}
```

---

### `GET /api/auth/me`
Fetches current logged-in user profile from token.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ user object }`

---

### `PUT /api/users/{id}/profile`
Updates a user profile.
- **Request Body**:
```json
{
  "name": "Arsh Sharma",
  "headline": "Lead Frontend Architect",
  "phone": "+91 98765 43210",
  "location": "Bengaluru, India",
  "bio": "Building high scale web portals...",
  "resumeUrl": "https://drive.google.com/...",
  "portfolioUrl": "https://portfolio.dev",
  "githubUrl": "https://github.com/arsh",
  "linkedinUrl": "https://linkedin.com/in/arsh",
  "skills": ["React", "TypeScript", "Next.js", "Node.js"]
}
```
- **Response `200 OK`**: `{ updated user object }`

---

## 2. Jobs API

### `GET /api/jobs`
Fetches paginated and filtered job openings.
- **Query Parameters**:
  - `search` / `q` (string): Keyword search
  - `location` (string): Location filter
  - `category` (string): Department/Category (Engineering, Design, etc.)
  - `type` (string): Job type (Full-time, Contract, Internship, etc.)
  - `workMode` (string): Work mode (On-site, Hybrid, Remote)
  - `experienceLevel` (string): Fresher, Junior, Mid-level, Senior, Lead
  - `recruiterId` (number, optional): Filter by recruiter's posted jobs
  - `companyId` (number, optional): Filter by company
  - `sort` (string): `newest`, `salary_high`, `relevance`
  - `page` (number): 1-indexed page number
  - `limit` (number): Page size (default 8)
- **Response `200 OK`**:
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Senior Frontend Engineer (React)",
      "companyId": 1,
      "companyName": "Zenlytics",
      "category": "Engineering",
      "type": "Full-time",
      "workMode": "Remote",
      "experienceLevel": "Senior",
      "location": "Bengaluru (Remote)",
      "salaryMin": 1800000,
      "salaryMax": 3000000,
      "description": "Paragraph 1\n\nParagraph 2",
      "skills": ["React", "TypeScript", "Tailwind CSS"],
      "status": "OPEN",
      "featured": true,
      "applicantCount": 12,
      "createdAt": "2026-08-28T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 6
}
```

---

### `GET /api/jobs/{id}`
Fetches detailed info for a single job opening.
- **Response `200 OK`**: `{ job object }`

---

### `POST /api/jobs`
Creates a new job opening (Recruiter authenticated).
- **Request Body**:
```json
{
  "title": "Backend Java Engineer",
  "category": "Engineering",
  "type": "Full-time",
  "workMode": "Hybrid",
  "experienceLevel": "Mid-level",
  "location": "Bengaluru",
  "salaryMin": 1400000,
  "salaryMax": 2200000,
  "description": "Looking for a Spring Boot engineer...",
  "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker"]
}
```
- **Response `201 Created`**: `{ created job object }`

---

### `PUT /api/jobs/{id}`
Updates an existing job opening or its status (`OPEN` / `CLOSED`).
- **Response `200 OK`**: `{ updated job object }`

---

### `DELETE /api/jobs/{id}`
Deletes a job listing.
- **Response `200 OK`**: `{ "success": true }`

---

## 3. Applications API

### `POST /api/applications`
Submits a job application (Job Seeker authenticated).
- **Request Body**:
```json
{
  "jobId": 1,
  "candidateName": "Arsh Sharma",
  "candidateEmail": "arsh@demo.com",
  "candidatePhone": "+91 98765 43210",
  "experienceYears": "4",
  "resumeUrl": "https://drive.google.com/file/...",
  "coverNote": "I am excited to apply for this frontend role..."
}
```
- **Response `201 Created`**:
```json
{
  "id": 101,
  "jobId": 1,
  "jobTitle": "Senior Frontend Engineer (React)",
  "companyName": "Zenlytics",
  "userId": 1,
  "candidateName": "Arsh Sharma",
  "candidateEmail": "arsh@demo.com",
  "status": "APPLIED",
  "createdAt": "2026-08-31T12:00:00Z"
}
```

---

### `GET /api/applications/me`
Fetches all applications submitted by the current job seeker.
- **Response `200 OK`**: `[ array of application objects ]`

---

### `GET /api/recruiter/applications`
Fetches all applications submitted across all jobs posted by the logged-in recruiter.
- **Response `200 OK`**: `[ array of candidate application objects ]`

---

### `PATCH /api/applications/{id}/status`
Advances candidate status in the hiring pipeline.
- **Request Body**:
```json
{
  "status": "SHORTLISTED",
  "note": "Candidate has strong React skills. Invited for technical screening."
}
```
- **Valid Status Values**: `APPLIED`, `IN_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `OFFERED`, `REJECTED`, `WITHDRAWN`
- **Response `200 OK`**: `{ updated application object }`

---

### `POST /api/applications/{id}/withdraw`
Withdraws a candidate's application.
- **Response `200 OK`**: `{ "success": true }`

---

## 4. Bookmarks (Saved Jobs) API

- `GET /api/saved-jobs` — Returns array of saved job objects for current user.
- `POST /api/saved-jobs/toggle/{jobId}` — Toggles bookmark state for a job. Returns `{ "saved": true|false }`.
- `GET /api/saved-jobs/check/{jobId}` — Checks if a job is saved. Returns `{ "saved": true|false }`.

---

## 5. Companies API

- `GET /api/companies` — Lists companies with search and pagination.
- `GET /api/companies/{id}` — Fetches company details and open roles count.
- `PUT /api/companies/{id}` — Updates company branding, description, website, and team size.

---

## 6. Admin & Analytics API

- `GET /api/admin/stats` — Platform metrics (total users, active jobs, applications, category stats, monthly throughput).
- `GET /api/admin/users` — User management directory with filters for role and active status.
- `PATCH /api/admin/users/{id}/toggle-status` — Toggles active/suspended state for a user account.
- `DELETE /api/admin/users/{id}` — Deletes user account.
