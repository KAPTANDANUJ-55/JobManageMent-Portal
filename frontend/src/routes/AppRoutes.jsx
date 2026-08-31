import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@/utils/constants';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import JobsPage from '@/pages/public/JobsPage';
import JobDetailPage from '@/pages/public/JobDetailPage';
import CompaniesPage from '@/pages/public/CompaniesPage';
import CompanyDetailPage from '@/pages/public/CompanyDetailPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Seeker Pages
import SeekerDashboardPage from '@/pages/seeker/SeekerDashboardPage';
import MyApplicationsPage from '@/pages/seeker/MyApplicationsPage';
import SavedJobsPage from '@/pages/seeker/SavedJobsPage';
import SeekerProfilePage from '@/pages/seeker/SeekerProfilePage';

// Recruiter Pages
import RecruiterDashboardPage from '@/pages/recruiter/RecruiterDashboardPage';
import ManageJobsPage from '@/pages/recruiter/ManageJobsPage';
import PostJobPage from '@/pages/recruiter/PostJobPage';
import ApplicantTrackingPage from '@/pages/recruiter/ApplicantTrackingPage';
import RecruiterCompanyPage from '@/pages/recruiter/RecruiterCompanyPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import JobModerationPage from '@/pages/admin/JobModerationPage';
import SystemSettingsPage from '@/pages/admin/SystemSettingsPage';

// Error Pages
import NotFoundPage from '@/pages/errors/NotFoundPage';
import UnauthorizedPage from '@/pages/errors/UnauthorizedPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Job Seeker Portal */}
      <Route
        path="/seeker"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SEEKER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SeekerDashboardPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="profile" element={<SeekerProfilePage />} />
      </Route>

      {/* Recruiter / Employer Portal */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboardPage />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="jobs/new" element={<PostJobPage />} />
        <Route path="jobs/:id/edit" element={<PostJobPage />} />
        <Route path="applicants" element={<ApplicantTrackingPage />} />
        <Route path="company" element={<RecruiterCompanyPage />} />
      </Route>

      {/* Administrator Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="jobs" element={<JobModerationPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
      </Route>
    </Routes>
  );
}
