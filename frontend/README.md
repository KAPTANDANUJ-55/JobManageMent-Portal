# JobHub — Job Management Portal (Frontend)

A modern, responsive, full-featured web frontend for the **Job Management Portal** built with **React 18**, **Vite**, **Tailwind CSS**, **Lucide React**, and **Recharts**.

---

## ✨ Key Features

### 🌐 Public Portal
- **Home Landing Page**: Keyword and location search bar, live category explorer, featured job openings with 1-click apply, top hiring companies, and value proposition highlights.
- **Jobs Discovery**: Real-time keyword search, location filtering, faceted sidebar filters (Work Mode: Remote/Hybrid/Onsite, Job Type, Experience Level, Department), salary range, and responsive mobile filter drawer.
- **Job Detail Page**: Comprehensive role overview, formatted paragraphs, required skills badges, compensation range, perks, company snapshot, and similar job recommendations.
- **Interactive Apply Modal**: Autofills user profile info, resume URL, contact details, custom cover note, and instant optimistic application submission.
- **Companies Directory & Detail**: Browse hiring companies, inspect team sizes, ratings, locations, and view all active openings per company.

### 👤 Job Seeker Portal (`/seeker`)
- **Dashboard**: Application metrics (Total Sent, In Review, Interviews, Saved), profile completeness meter, and recommended openings tailored to candidate skills.
- **My Applications**: Filter by status, interactive **Pipeline Progression Stepper** (*Applied → In Review → Shortlisted → Interview → Offer*), application notes from recruiters, and application withdrawal.
- **Saved Bookmarks**: Manage and apply to saved jobs with one click.
- **Profile & Resume Manager**: Update headline, bio, location, phone, uploaded resume URL, interactive skills tag manager with suggestions, and portfolio links (GitHub, LinkedIn).

### 🏢 Recruiter / Employer Portal (`/recruiter`)
- **Dashboard**: Active postings count, total applicants, hiring pipeline funnel bar chart (Recharts), and recent applicant activity stream.
- **Manage Jobs**: Data table with status toggles (Active / Closed), applicant counters, edit job, and delete actions.
- **Post & Edit Job Wizard**: Multi-section form (Role info, Salary range in INR, formatted description, required tech stack chips) with live preview modal.
- **Candidate ATS Pipeline**: Interactive Kanban board + table view with candidate filtering per opening, and candidate detail modal for advancing stages (*Applied → In Review → Shortlisted → Interview → Offered → Rejected*).
- **Company Profile**: Customize company branding, website, size, and culture description.

### 🛡️ Administrator Portal (`/admin`)
- **Analytics Dashboard**: Real-time platform KPI metrics, monthly application throughput area chart, and department distribution chart.
- **User Account Directory**: Search and filter all Job Seekers, Recruiters, and Admins; suspend/reactivate or delete accounts.
- **Job Moderation Center**: Platform-wide master job moderation and deletion.
- **System & Demo Tools**: 1-click **Reset Demo DB** controller to restore mock database back to pristine seed data.

---

## ⚡ Quick Demo Switcher (1-Click Personas)

A floating **Quick Demo Switcher** widget is accessible at the bottom-left of the screen on all pages. You can also sign in via the `/login` page with 1-click demo buttons:

| Persona | Account Name | Email | Password |
|---|---|---|---|
| **Job Seeker** | Arsh Sharma | `arsh@demo.com` | `Password@123` |
| **Recruiter** | Zenlytics / TechCorp | `recruiter@demo.com` | `Password@123` |
| **Administrator** | System Admin | `admin@demo.com` | `Password@123` |

---

## 🛠️ Project Structure

```
frontend/
├── src/
│   ├── api/                   # Unified API services + Mock in-browser DB
│   │   ├── client.js          # Axios client with JWT interceptors & mock switch
│   │   ├── index.js           # Domain API methods (authApi, jobsApi, applicationsApi, etc.)
│   │   └── mock/
│   │       ├── db.js          # Seed dataset (India-flavored companies, jobs, users)
│   │       └── handlers.js    # In-browser mock handlers persisting to localStorage
│   ├── components/
│   │   ├── common/            # Navbar, Footer, ToastContainer, DemoRoleSwitcher, ScrollToTop
│   │   ├── layouts/           # PublicLayout, DashboardLayout
│   │   ├── jobs/              # JobCard, JobFilters, ApplyModal
│   │   ├── candidates/        # CandidateCard, CandidateDetailModal
│   │   └── ui/                # Button, Card, Badge, Modal, Input, Textarea, Select, Tabs, etc.
│   ├── context/               # AuthContext, ToastContext, NotificationContext, ThemeContext
│   ├── pages/
│   │   ├── public/            # HomePage, JobsPage, JobDetailPage, CompaniesPage, CompanyDetailPage
│   │   ├── auth/              # LoginPage, RegisterPage
│   │   ├── seeker/            # SeekerDashboard, MyApplications, SavedJobs, SeekerProfile
│   │   ├── recruiter/         # RecruiterDashboard, ManageJobs, PostJob, ApplicantTracking, RecruiterCompany
│   │   ├── admin/             # AdminDashboard, UserManagement, JobModeration, SystemSettings
│   │   └── errors/            # NotFoundPage, UnauthorizedPage
│   ├── routes/                # ProtectedRoute, AppRoutes
│   ├── utils/                 # Constants, validators, formatters, cn
│   ├── App.jsx                # Router & global modals
│   ├── main.jsx               # React 18 root with providers
│   └── index.css              # Global styles, Tailwind directives, animations
├── API_CONTRACT.md            # Detailed REST API specification for backend developers
├── tailwind.config.js         # Custom color palette, fonts, keyframe animations
├── vite.config.js             # Vite configuration with @ path aliases & proxy
└── package.json
```

---

## 🔌 Backend Integration (Connecting Spring Boot)

The frontend is built to be completely decoupled from the backend.

1. Review **`API_CONTRACT.md`** for the full REST API specification.
2. In `frontend/.env`, set:
   ```env
   VITE_USE_MOCKS=false
   VITE_API_BASE_URL=/api
   VITE_PROXY_TARGET=http://localhost:8080
   ```
3. Start your Spring Boot application on port `8080`.
4. All API requests (`/api/*`) will now proxy directly to your Spring Boot REST controllers without needing any frontend component modifications.

---

## 🚀 Getting Started Locally

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Scripts

- `npm run dev` — Start Vite local dev server with hot module replacement.
- `npm run build` — Build production bundle to `dist/`.
- `npm run preview` — Preview production build locally.
- `npm run lint` — Run ESLint check (`0 errors, 0 warnings`).
