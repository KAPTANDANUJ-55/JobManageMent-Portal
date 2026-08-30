// ---------------------------------------------------------------------------
// Unified Domain API Services
// Automatically switches between Mock DB and Spring Boot endpoints
// ---------------------------------------------------------------------------
import { USE_MOCKS, liveClient, mockHandlers } from './client';

export const authApi = {
  login: async (credentials) => {
    if (USE_MOCKS) return mockHandlers.mockLogin(credentials);
    return liveClient.post('/auth/login', credentials);
  },

  register: async (userData) => {
    if (USE_MOCKS) return mockHandlers.mockRegister(userData);
    return liveClient.post('/auth/register', userData);
  },

  getMe: async () => {
    if (USE_MOCKS) return mockHandlers.mockGetCurrentUser();
    return liveClient.get('/auth/me');
  },

  updateProfile: async (userId, updates) => {
    if (USE_MOCKS) return mockHandlers.mockUpdateProfile(userId, updates);
    return liveClient.put(`/users/${userId}/profile`, updates);
  },
};

export const jobsApi = {
  getJobs: async (params) => {
    if (USE_MOCKS) return mockHandlers.mockGetJobs(params);
    return liveClient.get('/jobs', { params });
  },

  getJobById: async (id) => {
    if (USE_MOCKS) return mockHandlers.mockGetJobById(id);
    return liveClient.get(`/jobs/${id}`);
  },

  createJob: async (user, jobData) => {
    if (USE_MOCKS) return mockHandlers.mockCreateJob(user, jobData);
    return liveClient.post('/jobs', jobData);
  },

  updateJob: async (id, updates) => {
    if (USE_MOCKS) return mockHandlers.mockUpdateJob(id, updates);
    return liveClient.put(`/jobs/${id}`, updates);
  },

  deleteJob: async (id) => {
    if (USE_MOCKS) return mockHandlers.mockDeleteJob(id);
    return liveClient.delete(`/jobs/${id}`);
  },
};

export const applicationsApi = {
  apply: async (user, applicationData) => {
    if (USE_MOCKS) return mockHandlers.mockApplyToJob(user, applicationData);
    return liveClient.post('/applications', applicationData);
  },

  getMyApplications: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockGetMyApplications(userId);
    return liveClient.get('/applications/me');
  },

  getJobApplicants: async (jobId) => {
    if (USE_MOCKS) return mockHandlers.mockGetJobApplicants(jobId);
    return liveClient.get(`/jobs/${jobId}/applications`);
  },

  getAllRecruiterApplicants: async (recruiterId) => {
    if (USE_MOCKS) return mockHandlers.mockGetAllRecruiterApplicants(recruiterId);
    return liveClient.get(`/recruiter/applications`);
  },

  updateStatus: async (applicationId, status, note) => {
    if (USE_MOCKS) return mockHandlers.mockUpdateApplicationStatus(applicationId, status, note);
    return liveClient.patch(`/applications/${applicationId}/status`, { status, note });
  },

  withdraw: async (userId, applicationId) => {
    if (USE_MOCKS) return mockHandlers.mockWithdrawApplication(userId, applicationId);
    return liveClient.post(`/applications/${applicationId}/withdraw`);
  },
};

export const savedJobsApi = {
  getSavedJobs: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockGetSavedJobs(userId);
    return liveClient.get('/saved-jobs');
  },

  toggleSaveJob: async (userId, jobId) => {
    if (USE_MOCKS) return mockHandlers.mockToggleSaveJob(userId, jobId);
    return liveClient.post(`/saved-jobs/toggle/${jobId}`);
  },

  checkJobSaved: async (userId, jobId) => {
    if (USE_MOCKS) return mockHandlers.mockCheckJobSaved(userId, jobId);
    return liveClient.get(`/saved-jobs/check/${jobId}`);
  },
};

export const companiesApi = {
  getCompanies: async (params) => {
    if (USE_MOCKS) return mockHandlers.mockGetCompanies(params);
    return liveClient.get('/companies', { params });
  },

  getCompanyById: async (id) => {
    if (USE_MOCKS) return mockHandlers.mockGetCompanyById(id);
    return liveClient.get(`/companies/${id}`);
  },

  updateCompany: async (id, updates) => {
    if (USE_MOCKS) return mockHandlers.mockUpdateCompany(id, updates);
    return liveClient.put(`/companies/${id}`, updates);
  },
};

export const adminApi = {
  getStats: async () => {
    if (USE_MOCKS) return mockHandlers.mockGetAdminStats();
    return liveClient.get('/admin/stats');
  },

  getUsers: async (params) => {
    if (USE_MOCKS) return mockHandlers.mockGetUsers(params);
    return liveClient.get('/admin/users', { params });
  },

  toggleUserStatus: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockToggleUserStatus(userId);
    return liveClient.patch(`/admin/users/${userId}/toggle-status`);
  },

  deleteUser: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockDeleteUser(userId);
    return liveClient.delete(`/admin/users/${userId}`);
  },
};

export const notificationsApi = {
  getNotifications: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockGetNotifications(userId);
    return liveClient.get('/notifications');
  },

  markRead: async (id) => {
    if (USE_MOCKS) return mockHandlers.mockMarkNotificationRead(id);
    return liveClient.patch(`/notifications/${id}/read`);
  },

  markAllRead: async (userId) => {
    if (USE_MOCKS) return mockHandlers.mockMarkAllNotificationsRead(userId);
    return liveClient.post('/notifications/mark-all-read');
  },
};

export const systemApi = {
  resetDemoState: async () => {
    if (USE_MOCKS) return mockHandlers.mockResetDemoState();
    return liveClient.post('/system/reset-demo');
  },
};
