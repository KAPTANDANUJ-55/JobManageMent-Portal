// ---------------------------------------------------------------------------
// Mock API Handlers
// Simulates Spring Boot REST endpoints against the in-browser mock database
// Persists modifications to localStorage so demos survive page reloads.
// ---------------------------------------------------------------------------
import db, {
  nextId,
  snapshot,
  hydrate,
  resetSeed,
  DEMO_PASSWORD,
} from './db';
import { ROLES, JOB_STATUS, APPLICATION_STATUS, TOKEN_KEY, USER_KEY } from '@/utils/constants';

const STORAGE_KEY = 'jobhub_mock_db_v3';

// Initialize from localStorage if present
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      hydrate(data);
    }
  } catch (e) {
    console.warn('Failed to load persisted mock DB state:', e);
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
  } catch (e) {
    console.warn('Failed to persist mock DB state:', e);
  }
}

// Initial hydration
loadPersistedState();

// Helper to simulate realistic network delay
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to sanitize user (remove password)
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

// ---------------------------------------------------------------------------
// Auth Handlers
// ---------------------------------------------------------------------------
export async function mockLogin({ email, password }) {
  await delay(200);
  const normalizedEmail = email?.trim().toLowerCase();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && (u.password === password || password === DEMO_PASSWORD)
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.active === false) {
    throw new Error('Your account has been suspended. Please contact support.');
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  const safeUser = sanitizeUser(user);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

  return { token, user: safeUser };
}

export async function mockRegister({ name, email, password, role = ROLES.SEEKER, companyName, headline, phone }) {
  await delay(250);
  const normalizedEmail = email?.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  let companyId = null;
  if (role === ROLES.RECRUITER && companyName) {
    // Check if company exists or create a new one
    let comp = db.companies.find((c) => c.name.toLowerCase() === companyName.trim().toLowerCase());
    if (!comp) {
      comp = {
        id: nextId(db.companies),
        name: companyName.trim(),
        logoText: companyName.slice(0, 2).toUpperCase(),
        industry: 'Technology',
        location: 'Bengaluru',
        size: '10-50 employees',
        website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        about: `${companyName} is hiring top talent on JobHub.`,
        rating: 4.5,
      };
      db.companies.push(comp);
    }
    companyId = comp.id;
  }

  const newUser = {
    id: nextId(db.users),
    name: name.trim(),
    email: normalizedEmail,
    password: password || DEMO_PASSWORD,
    role,
    phone: phone || null,
    location: 'Bengaluru',
    headline: headline || (role === ROLES.RECRUITER ? `Recruiter at ${companyName || 'JobHub'}` : 'Aspiring Professional'),
    bio: '',
    skills: role === ROLES.SEEKER ? ['JavaScript', 'React', 'Problem Solving'] : [],
    experienceYears: 1,
    education: [],
    resumeName: null,
    resumeUrl: null,
    companyId,
    active: true,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  persistState();

  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  const safeUser = sanitizeUser(newUser);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

  return { token, user: safeUser };
}

export async function mockGetCurrentUser() {
  await delay(100);
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    const user = db.users.find((u) => u.id === cached.id);
    if (!user || user.active === false) return null;
    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export async function mockUpdateProfile(userId, updates) {
  await delay(200);
  const idx = db.users.findIndex((u) => u.id === Number(userId));
  if (idx === -1) throw new Error('User not found');

  db.users[idx] = {
    ...db.users[idx],
    ...updates,
    id: db.users[idx].id, // preserve ID
  };
  persistState();

  const safe = sanitizeUser(db.users[idx]);
  localStorage.setItem(USER_KEY, JSON.stringify(safe));
  return safe;
}

// ---------------------------------------------------------------------------
// Jobs Handlers
// ---------------------------------------------------------------------------
export async function mockGetJobs(params = {}) {
  await delay(150);
  const {
    query = '',
    location = '',
    category = '',
    jobType = '',
    experienceLevel = '',
    workMode = '',
    minSalary,
    maxSalary,
    companyId,
    recruiterId,
    status = JOB_STATUS.OPEN,
    sortBy = 'newest', // 'newest', 'salary_high', 'salary_low', 'views'
    page = 1,
    limit = 10,
    includeAllStatuses = false,
  } = params;

  let list = db.jobs.map((job) => {
    const company = db.companies.find((c) => c.id === job.companyId) || {
      name: 'Unknown Company',
      logoText: 'UC',
      location: job.location,
    };
    const applicantCount = db.applications.filter((a) => a.jobId === job.id).length;
    return {
      ...job,
      company,
      applicantCount,
    };
  });

  // Filter by status unless includeAllStatuses is true
  if (!includeAllStatuses && status) {
    list = list.filter((j) => j.status === status);
  }

  // Search query (matches title, company name, skills, description)
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company?.name?.toLowerCase().includes(q) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(q))) ||
        (j.description && j.description.toLowerCase().includes(q))
    );
  }

  // Location filter
  if (location && location.trim()) {
    const loc = location.trim().toLowerCase();
    list = list.filter((j) => j.location.toLowerCase().includes(loc) || j.workMode.toLowerCase().includes(loc));
  }

  // Category filter
  if (category && category !== 'All') {
    list = list.filter((j) => j.category === category);
  }

  // Job Type filter
  if (jobType && jobType !== 'All') {
    list = list.filter((j) => j.jobType === jobType);
  }

  // Experience level
  if (experienceLevel && experienceLevel !== 'All') {
    list = list.filter((j) => j.experienceLevel === experienceLevel);
  }

  // Work Mode
  if (workMode && workMode !== 'All') {
    list = list.filter((j) => j.workMode === workMode);
  }

  // Salary range
  if (minSalary != null && minSalary !== '') {
    list = list.filter((j) => (j.maxSalary != null ? j.maxSalary >= Number(minSalary) : true));
  }
  if (maxSalary != null && maxSalary !== '') {
    list = list.filter((j) => (j.minSalary != null ? j.minSalary <= Number(maxSalary) : true));
  }

  // Filter by company
  if (companyId) {
    list = list.filter((j) => j.companyId === Number(companyId));
  }

  // Filter by recruiter
  if (recruiterId) {
    list = list.filter((j) => j.recruiterId === Number(recruiterId));
  }

  // Sort
  if (sortBy === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'salary_high') {
    list.sort((a, b) => (b.maxSalary || b.minSalary || 0) - (a.maxSalary || a.minSalary || 0));
  } else if (sortBy === 'salary_low') {
    list.sort((a, b) => (a.minSalary || 0) - (b.minSalary || 0));
  } else if (sortBy === 'views') {
    list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  }

  const total = list.length;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    jobs: paginated,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function mockGetJobById(id) {
  await delay(120);
  const job = db.jobs.find((j) => j.id === Number(id));
  if (!job) throw new Error('Job not found');

  // Increment views
  job.viewsCount = (job.viewsCount || 0) + 1;
  persistState();

  const company = db.companies.find((c) => c.id === job.companyId) || {
    name: 'Unknown Company',
    logoText: 'UC',
    location: job.location,
  };
  const applicantCount = db.applications.filter((a) => a.jobId === job.id).length;
  const recruiter = sanitizeUser(db.users.find((u) => u.id === job.recruiterId));

  return {
    ...job,
    company,
    applicantCount,
    recruiter,
  };
}

export async function mockCreateJob(recruiterUser, jobData) {
  await delay(250);
  if (!recruiterUser || (recruiterUser.role !== ROLES.RECRUITER && recruiterUser.role !== ROLES.ADMIN)) {
    throw new Error('Only recruiters can post jobs');
  }

  let companyId = recruiterUser.companyId;
  if (!companyId) {
    const comp = db.companies[0];
    companyId = comp ? comp.id : 1;
  }

  const newJob = {
    id: nextId(db.jobs),
    recruiterId: recruiterUser.id,
    companyId,
    title: jobData.title,
    category: jobData.category,
    jobType: jobData.jobType,
    experienceLevel: jobData.experienceLevel,
    workMode: jobData.workMode,
    location: jobData.location || 'Bengaluru',
    minSalary: jobData.minSalary ? Number(jobData.minSalary) : null,
    maxSalary: jobData.maxSalary ? Number(jobData.maxSalary) : null,
    description: jobData.description,
    responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : (jobData.responsibilities || '').split('\n').filter(Boolean),
    requirements: Array.isArray(jobData.requirements) ? jobData.requirements : (jobData.requirements || '').split('\n').filter(Boolean),
    perks: Array.isArray(jobData.perks) ? jobData.perks : (jobData.perks || '').split('\n').filter(Boolean),
    skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    status: jobData.status || JOB_STATUS.OPEN,
    featured: Boolean(jobData.featured),
    deadline: jobData.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.jobs.unshift(newJob);
  persistState();

  // Create notification for recruiter
  db.notifications.unshift({
    id: nextId(db.notifications),
    userId: recruiterUser.id,
    title: 'Job posted successfully',
    body: `Your job listing "${newJob.title}" is now active and accepting applicants.`,
    read: false,
    createdAt: new Date().toISOString(),
  });
  persistState();

  return newJob;
}

export async function mockUpdateJob(jobId, updates) {
  await delay(200);
  const idx = db.jobs.findIndex((j) => j.id === Number(jobId));
  if (idx === -1) throw new Error('Job not found');

  db.jobs[idx] = {
    ...db.jobs[idx],
    ...updates,
    id: db.jobs[idx].id,
    updatedAt: new Date().toISOString(),
  };
  persistState();
  return db.jobs[idx];
}

export async function mockDeleteJob(jobId) {
  await delay(150);
  const idx = db.jobs.findIndex((j) => j.id === Number(jobId));
  if (idx === -1) throw new Error('Job not found');

  db.jobs.splice(idx, 1);
  // Also remove applications associated
  const remainingApps = db.applications.filter((a) => a.jobId !== Number(jobId));
  db.applications.length = 0;
  db.applications.push(...remainingApps);

  persistState();
  return { success: true, message: 'Job deleted successfully' };
}

// ---------------------------------------------------------------------------
// Applications Handlers
// ---------------------------------------------------------------------------
export async function mockApplyToJob(user, { jobId, coverLetter, resumeUrl, resumeName, expectedCtc, noticePeriod, portfolioUrl }) {
  await delay(300);
  if (!user) throw new Error('You must be logged in to apply');
  if (user.role !== ROLES.SEEKER) throw new Error('Only job seekers can submit applications');

  const job = db.jobs.find((j) => j.id === Number(jobId));
  if (!job) throw new Error('Job not found');
  if (job.status !== JOB_STATUS.OPEN) throw new Error('This job is no longer accepting applications');

  const existing = db.applications.find((a) => a.jobId === Number(jobId) && a.userId === user.id);
  if (existing) throw new Error('You have already applied for this position');

  const application = {
    id: nextId(db.applications),
    jobId: Number(jobId),
    userId: user.id,
    status: APPLICATION_STATUS.APPLIED,
    coverLetter: coverLetter || '',
    resumeUrl: resumeUrl || user.resumeUrl || 'https://example.com/resume.pdf',
    resumeName: resumeName || user.resumeName || 'Resume.pdf',
    expectedCtc: expectedCtc || null,
    noticePeriod: noticePeriod || 'Immediate',
    portfolioUrl: portfolioUrl || null,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    history: [
      {
        status: APPLICATION_STATUS.APPLIED,
        timestamp: new Date().toISOString(),
        note: 'Application submitted by candidate',
      },
    ],
  };

  db.applications.unshift(application);

  // Send notification to Recruiter
  if (job.recruiterId) {
    db.notifications.unshift({
      id: nextId(db.notifications),
      userId: job.recruiterId,
      title: 'New Applicant Received',
      body: `${user.name} applied for ${job.title}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Send notification to Seeker
  db.notifications.unshift({
    id: nextId(db.notifications),
    userId: user.id,
    title: 'Application Submitted',
    body: `You successfully applied for ${job.title} at ${db.companies.find((c) => c.id === job.companyId)?.name || 'Company'}.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  persistState();
  return application;
}

export async function mockGetMyApplications(userId) {
  await delay(180);
  const apps = db.applications.filter((a) => a.userId === Number(userId));
  return apps.map((app) => {
    const job = db.jobs.find((j) => j.id === app.jobId) || {
      title: 'Job Position',
      location: 'Bengaluru',
      jobType: 'Full-time',
      companyId: 1,
    };
    const company = db.companies.find((c) => c.id === job.companyId) || {
      name: 'Company',
      logoText: 'CP',
    };
    return {
      ...app,
      job: {
        ...job,
        company,
      },
    };
  });
}

export async function mockGetJobApplicants(jobId) {
  await delay(200);
  const apps = db.applications.filter((a) => a.jobId === Number(jobId));
  return apps.map((app) => {
    const candidate = sanitizeUser(db.users.find((u) => u.id === app.userId)) || {
      name: 'Applicant',
      email: 'applicant@example.com',
      skills: [],
      headline: '',
    };
    return {
      ...app,
      candidate,
    };
  });
}

export async function mockGetAllRecruiterApplicants(recruiterId) {
  await delay(200);
  const recruiterJobs = db.jobs.filter((j) => j.recruiterId === Number(recruiterId));
  const jobIds = recruiterJobs.map((j) => j.id);
  const apps = db.applications.filter((a) => jobIds.includes(a.jobId));

  return apps.map((app) => {
    const job = recruiterJobs.find((j) => j.id === app.jobId);
    const candidate = sanitizeUser(db.users.find((u) => u.id === app.userId));
    return {
      ...app,
      job,
      candidate,
    };
  });
}

export async function mockUpdateApplicationStatus(applicationId, newStatus, note = '') {
  await delay(200);
  const app = db.applications.find((a) => a.id === Number(applicationId));
  if (!app) throw new Error('Application not found');

  app.status = newStatus;
  app.updatedAt = new Date().toISOString();
  if (!app.history) app.history = [];
  app.history.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${newStatus}`,
  });

  // Notify the candidate
  const job = db.jobs.find((j) => j.id === app.jobId);
  db.notifications.unshift({
    id: nextId(db.notifications),
    userId: app.userId,
    title: `Application Status Updated: ${newStatus}`,
    body: `Your application for ${job?.title || 'the position'} has moved to ${newStatus}.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  persistState();
  return app;
}

export async function mockWithdrawApplication(userId, applicationId) {
  await delay(150);
  const app = db.applications.find((a) => a.id === Number(applicationId) && a.userId === Number(userId));
  if (!app) throw new Error('Application not found');

  app.status = APPLICATION_STATUS.WITHDRAWN;
  app.updatedAt = new Date().toISOString();
  if (!app.history) app.history = [];
  app.history.push({
    status: APPLICATION_STATUS.WITHDRAWN,
    timestamp: new Date().toISOString(),
    note: 'Application withdrawn by candidate',
  });

  persistState();
  return app;
}

// ---------------------------------------------------------------------------
// Saved Jobs
// ---------------------------------------------------------------------------
export async function mockGetSavedJobs(userId) {
  await delay(150);
  const saved = db.savedJobs.filter((s) => s.userId === Number(userId));
  const savedJobIds = saved.map((s) => s.jobId);
  const jobList = db.jobs.filter((j) => savedJobIds.includes(j.id));

  return jobList.map((job) => {
    const company = db.companies.find((c) => c.id === job.companyId);
    const applicantCount = db.applications.filter((a) => a.jobId === job.id).length;
    return {
      ...job,
      company,
      applicantCount,
      savedAt: saved.find((s) => s.jobId === job.id)?.savedAt,
    };
  });
}

export async function mockToggleSaveJob(userId, jobId) {
  await delay(100);
  const idx = db.savedJobs.findIndex((s) => s.userId === Number(userId) && s.jobId === Number(jobId));
  let isSaved = false;
  if (idx > -1) {
    db.savedJobs.splice(idx, 1);
    isSaved = false;
  } else {
    db.savedJobs.push({
      id: nextId(db.savedJobs),
      userId: Number(userId),
      jobId: Number(jobId),
      savedAt: new Date().toISOString(),
    });
    isSaved = true;
  }
  persistState();
  return { isSaved, jobId: Number(jobId) };
}

export async function mockCheckJobSaved(userId, jobId) {
  if (!userId) return false;
  return db.savedJobs.some((s) => s.userId === Number(userId) && s.jobId === Number(jobId));
}

// ---------------------------------------------------------------------------
// Companies Handlers
// ---------------------------------------------------------------------------
export async function mockGetCompanies(params = {}) {
  await delay(150);
  const { query = '', industry = '', location = '' } = params;

  let list = db.companies.map((c) => {
    const openJobsCount = db.jobs.filter((j) => j.companyId === c.id && j.status === JOB_STATUS.OPEN).length;
    return {
      ...c,
      openJobsCount,
    };
  });

  if (query) {
    const q = query.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q) || c.about.toLowerCase().includes(q));
  }
  if (industry && industry !== 'All') {
    list = list.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()));
  }
  if (location) {
    list = list.filter((c) => c.location.toLowerCase().includes(location.toLowerCase()));
  }

  return list;
}

export async function mockGetCompanyById(id) {
  await delay(150);
  const company = db.companies.find((c) => c.id === Number(id));
  if (!company) throw new Error('Company not found');

  const jobs = db.jobs.filter((j) => j.companyId === Number(id) && j.status === JOB_STATUS.OPEN).map((j) => ({
    ...j,
    company,
    applicantCount: db.applications.filter((a) => a.jobId === j.id).length,
  }));

  return {
    ...company,
    jobs,
  };
}

export async function mockUpdateCompany(id, updates) {
  await delay(200);
  const idx = db.companies.findIndex((c) => c.id === Number(id));
  if (idx === -1) throw new Error('Company not found');

  db.companies[idx] = {
    ...db.companies[idx],
    ...updates,
  };
  persistState();
  return db.companies[idx];
}

// ---------------------------------------------------------------------------
// Admin Handlers
// ---------------------------------------------------------------------------
export async function mockGetAdminStats() {
  await delay(180);
  const totalUsers = db.users.length;
  const seekers = db.users.filter((u) => u.role === ROLES.SEEKER).length;
  const recruiters = db.users.filter((u) => u.role === ROLES.RECRUITER).length;
  const totalJobs = db.jobs.length;
  const activeJobs = db.jobs.filter((j) => j.status === JOB_STATUS.OPEN).length;
  const pendingJobs = db.jobs.filter((j) => j.status === JOB_STATUS.PENDING).length;
  const totalApplications = db.applications.length;
  const totalCompanies = db.companies.length;

  // Monthly trends mock data
  const monthlyTrends = [
    { month: 'Jan', applications: 120, postings: 18, users: 45 },
    { month: 'Feb', applications: 180, postings: 24, users: 70 },
    { month: 'Mar', applications: 240, postings: 32, users: 110 },
    { month: 'Apr', applications: 310, postings: 45, users: 155 },
    { month: 'May', applications: 420, postings: 58, users: 210 },
    { month: 'Jun', applications: 510, postings: 64, users: 280 },
  ];

  // Category breakdown
  const categoryStats = [
    { name: 'Engineering', count: db.jobs.filter((j) => j.category === 'Engineering').length },
    { name: 'Design', count: db.jobs.filter((j) => j.category === 'Design').length },
    { name: 'Product', count: db.jobs.filter((j) => j.category === 'Product').length },
    { name: 'Data', count: db.jobs.filter((j) => j.category === 'Data & Analytics').length },
    { name: 'Marketing', count: db.jobs.filter((j) => j.category === 'Marketing').length },
  ];

  return {
    totalUsers,
    seekers,
    recruiters,
    totalJobs,
    activeJobs,
    pendingJobs,
    totalApplications,
    totalCompanies,
    monthlyTrends,
    categoryStats,
  };
}

export async function mockGetUsers(params = {}) {
  await delay(150);
  const { role, search = '', active } = params;
  let list = db.users.map((u) => sanitizeUser(u));

  if (role && role !== 'ALL') {
    list = list.filter((u) => u.role === role);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (active !== undefined && active !== '') {
    const isActive = active === 'true' || active === true;
    list = list.filter((u) => Boolean(u.active) === isActive);
  }

  return list;
}

export async function mockToggleUserStatus(userId) {
  await delay(150);
  const user = db.users.find((u) => u.id === Number(userId));
  if (!user) throw new Error('User not found');
  if (user.role === ROLES.ADMIN) throw new Error('Cannot suspend an Administrator');

  user.active = !user.active;
  persistState();
  return sanitizeUser(user);
}

export async function mockDeleteUser(userId) {
  await delay(180);
  const idx = db.users.findIndex((u) => u.id === Number(userId));
  if (idx === -1) throw new Error('User not found');
  if (db.users[idx].role === ROLES.ADMIN) throw new Error('Cannot delete an Administrator');

  db.users.splice(idx, 1);
  persistState();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Notifications Handlers
// ---------------------------------------------------------------------------
export async function mockGetNotifications(userId) {
  await delay(100);
  return db.notifications.filter((n) => n.userId === Number(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function mockMarkNotificationRead(id) {
  const item = db.notifications.find((n) => n.id === Number(id));
  if (item) {
    item.read = true;
    persistState();
  }
  return { success: true };
}

export async function mockMarkAllNotificationsRead(userId) {
  db.notifications.filter((n) => n.userId === Number(userId)).forEach((n) => {
    n.read = true;
  });
  persistState();
  return { success: true };
}

// ---------------------------------------------------------------------------
// Demo State Reset
// ---------------------------------------------------------------------------
export async function mockResetDemoState() {
  await delay(250);
  localStorage.removeItem(STORAGE_KEY);
  resetSeed();
  return { success: true, message: 'Mock database reset to original seed data' };
}
