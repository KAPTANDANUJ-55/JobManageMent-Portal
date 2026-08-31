import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { applicationsApi, savedJobsApi, jobsApi } from '@/api';
import {
  FileText,
  BookmarkCheck,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
  Zap,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import JobCard from '@/components/jobs/JobCard';
import ApplyModal from '@/components/jobs/ApplyModal';
import Skeleton from '@/components/ui/Skeleton';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
} from '@/utils/constants';
import { timeAgo, formatSalaryRange } from '@/utils/formatters';

export default function SeekerDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadSeekerData() {
      if (!user) return;
      try {
        setIsLoading(true);
        const [appsRes, savedRes, recJobsRes] = await Promise.all([
          applicationsApi.getMyApplications(user.id),
          savedJobsApi.getSavedJobs(user.id),
          jobsApi.getJobs({ limit: 4 }),
        ]);

        setApplications(appsRes || []);
        setSavedJobs(savedRes || []);
        setRecommendedJobs(recJobsRes.jobs || recJobsRes.slice?.(0, 4) || []);
      } catch (err) {
        console.error('Failed to load seeker dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSeekerData();
  }, [user]);

  const activeApps = applications.filter(
    (a) => a.status !== APPLICATION_STATUS.REJECTED && a.status !== APPLICATION_STATUS.WITHDRAWN
  );
  const interviewCount = applications.filter(
    (a) => a.status === APPLICATION_STATUS.INTERVIEW || a.status === APPLICATION_STATUS.OFFERED
  ).length;

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-warning-400" />
            <span>Job Seeker Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Seeker'}!
          </h1>
          <p className="text-xs sm:text-sm text-primary-100/90 max-w-xl">
            You have <span className="font-bold text-white">{activeApps.length} active applications</span> in review. Track your interview invites and discover new matches below.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link to="/jobs">
            <Button variant="white" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Find Jobs
            </Button>
          </Link>
          <Link to="/seeker/profile">
            <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
              Edit Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={applications.length}
          icon={<FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
          changeLabel="Across all tech roles"
        />
        <StatCard
          title="Active In Review"
          value={activeApps.length}
          icon={<TrendingUp className="w-5 h-5 text-info-600 dark:text-info-400" />}
          changeLabel="Under recruiter review"
        />
        <StatCard
          title="Interviews & Offers"
          value={interviewCount}
          icon={<Calendar className="w-5 h-5 text-success-600 dark:text-success-400" />}
          changeLabel="High priority stages"
        />
        <StatCard
          title="Saved Bookmarks"
          value={savedJobs.length}
          icon={<BookmarkCheck className="w-5 h-5 text-warning-600 dark:text-warning-400" />}
          changeLabel="Roles to apply for"
        />
      </div>

      {/* Main Grid: Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Recent Application Status
            </h2>
            <Link
              to="/seeker/applications"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              View all ({applications.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-3">
              <FileText className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto" />
              <h3 className="text-sm font-bold text-ink-900 dark:text-white">
                No job applications submitted yet
              </h3>
              <p className="text-xs text-ink-500 max-w-sm mx-auto">
                Explore openings matching your stack and submit your first application with 1 click.
              </p>
              <Link to="/jobs">
                <Button variant="primary" size="sm">
                  Search Open Roles
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => {
                const tone = APPLICATION_STATUS_TONE[app.status] || 'neutral';
                const label = APPLICATION_STATUS_LABELS[app.status] || app.status;

                return (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <Avatar name={app.companyName || 'Company'} size="md" className="rounded-xl shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-ink-900 dark:text-white">
                          {app.jobTitle}
                        </h4>
                        <p className="text-xs text-ink-500 font-medium">
                          {app.companyName} • Applied {timeAgo(app.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge tone={tone} size="md">
                        {label}
                      </Badge>
                      <Link to="/seeker/applications">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Timeline
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile Card & Recommended Jobs */}
        <div className="space-y-6">
          {/* Quick Profile Summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={user?.name || 'User'} size="lg" className="rounded-2xl" />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ink-900 dark:text-white truncate">
                  {user?.name}
                </h3>
                <p className="text-xs text-ink-500 truncate">
                  {user?.headline || 'Senior Software Engineer'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-600 dark:text-ink-300">
                <span>Profile Completeness</span>
                <span className="font-bold text-primary-600">85%</span>
              </div>
              <div className="w-full bg-ink-100 dark:bg-ink-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <Link to="/seeker/profile" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Update Profile & Resume
              </Button>
            </Link>
          </div>

          {/* Recommended Jobs Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Matched For You
              </h3>
              <Link to="/jobs" className="text-xs text-primary-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-xs font-bold text-ink-900 dark:text-white hover:text-primary-600 line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[11px] text-ink-500">
                        {job.companyName} • {job.location}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-ink-700 dark:text-ink-300 shrink-0">
                      {formatSalaryRange(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplyClick(job)}
                      className="text-[11px] py-1 px-3"
                    >
                      Quick Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={selectedJobForApply}
        />
      )}
    </div>
  );
}
