import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, applicationsApi } from '@/api';
import {
  Briefcase,
  Users,
  PlusCircle,
  UserCheck,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CandidateDetailModal from '@/components/candidates/CandidateDetailModal';
import Skeleton from '@/components/ui/Skeleton';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
} from '@/utils/constants';
import { timeAgo, formatSalaryRange } from '@/utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getJobs({ recruiterId: user.id }),
        applicationsApi.getAllRecruiterApplicants(user.id),
      ]);
      setJobs(jobsRes.jobs || jobsRes || []);
      setApplicants(appsRes || []);
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const activeJobsCount = jobs.filter((j) => j.status === 'OPEN' || !j.status).length;
  const shortlistedCount = applicants.filter(
    (a) => a.status === APPLICATION_STATUS.SHORTLISTED || a.status === APPLICATION_STATUS.INTERVIEW
  ).length;
  const offersCount = applicants.filter((a) => a.status === APPLICATION_STATUS.OFFERED).length;

  // Pipeline Chart Data
  const pipelineData = [
    { stage: 'Applied', count: applicants.filter((a) => a.status === APPLICATION_STATUS.APPLIED).length, color: '#64748B' },
    { stage: 'In Review', count: applicants.filter((a) => a.status === APPLICATION_STATUS.IN_REVIEW).length, color: '#3B82F6' },
    { stage: 'Shortlisted', count: applicants.filter((a) => a.status === APPLICATION_STATUS.SHORTLISTED).length, color: '#6366F1' },
    { stage: 'Interview', count: applicants.filter((a) => a.status === APPLICATION_STATUS.INTERVIEW).length, color: '#F59E0B' },
    { stage: 'Offered', count: applicants.filter((a) => a.status === APPLICATION_STATUS.OFFERED).length, color: '#10B981' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-ink-900 via-indigo-950 to-primary-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-success-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter ATS Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employer Portal • {user?.companyName || 'Tech Recruiting'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 max-w-xl">
            You have <span className="font-bold text-white">{applicants.length} total candidates</span> in your hiring pipeline across {activeJobsCount} active openings.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link to="/recruiter/jobs/new">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Post New Job
            </Button>
          </Link>
          <Link to="/recruiter/applicants">
            <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
              Candidate Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Job Postings"
          value={activeJobsCount}
          icon={<Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
          changeLabel="Live on job board"
        />
        <StatCard
          title="Total Candidates"
          value={applicants.length}
          icon={<Users className="w-5 h-5 text-info-600 dark:text-info-400" />}
          changeLabel="Applications received"
        />
        <StatCard
          title="Shortlisted & Interviews"
          value={shortlistedCount}
          icon={<UserCheck className="w-5 h-5 text-warning-600 dark:text-warning-400" />}
          changeLabel="In evaluation stages"
        />
        <StatCard
          title="Job Offers Extended"
          value={offersCount}
          icon={<Award className="w-5 h-5 text-success-600 dark:text-success-400" />}
          changeLabel="Offer stage"
        />
      </div>

      {/* Analytics Chart & Recent Applicants Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink-900 dark:text-white">
                Candidate Pipeline Funnel
              </h2>
              <p className="text-xs text-ink-500">Distribution of candidate applications by stage</p>
            </div>
            <Link to="/recruiter/applicants">
              <Button variant="outline" size="sm">
                Open ATS Kanban
              </Button>
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applicants Activity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink-900 dark:text-white">
              Recent Candidates
            </h3>
            <Link to="/recruiter/applicants" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <p className="text-xs text-ink-500 py-6 text-center">No applicants yet.</p>
          ) : (
            <div className="space-y-3">
              {applicants.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedCandidate(app);
                    setIsCandidateModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-ink-50 dark:bg-ink-950/60 hover:bg-primary-50/50 dark:hover:bg-primary-950/40 border border-ink-100 dark:border-ink-800 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-ink-900 dark:text-white truncate">
                      {app.candidateName || app.userName}
                    </h4>
                    <Badge tone={APPLICATION_STATUS_TONE[app.status] || 'neutral'} size="sm">
                      {APPLICATION_STATUS_LABELS[app.status] || app.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-ink-500 truncate">{app.jobTitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Job Postings Table Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Active Job Postings
            </h2>
            <p className="text-xs text-ink-500">Monitor candidate flow and performance per opening</p>
          </div>
          <Link to="/recruiter/jobs">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Manage All Jobs ({jobs.length})
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink-100 dark:border-ink-800 text-ink-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Job Title</th>
                <th className="pb-3">Location & Mode</th>
                <th className="pb-3">Salary Range</th>
                <th className="pb-3">Applicants</th>
                <th className="pb-3">Posted</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
              {jobs.slice(0, 5).map((j) => (
                <tr key={j.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30">
                  <td className="py-3.5 font-bold text-ink-900 dark:text-white">
                    <Link to={`/jobs/${j.id}`} className="hover:text-primary-600">
                      {j.title}
                    </Link>
                  </td>
                  <td className="py-3.5 text-ink-600 dark:text-ink-300">
                    {j.location} ({j.workMode})
                  </td>
                  <td className="py-3.5 font-semibold text-ink-800 dark:text-ink-200">
                    {formatSalaryRange(j.salaryMin, j.salaryMax)}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-[11px]">
                      {j.applicantCount || 0} candidates
                    </span>
                  </td>
                  <td className="py-3.5 text-ink-400">{timeAgo(j.createdAt)}</td>
                  <td className="py-3.5 text-right">
                    <Link to={`/recruiter/applicants?jobId=${j.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Review ATS
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          isOpen={isCandidateModalOpen}
          onClose={() => setIsCandidateModalOpen(false)}
          application={selectedCandidate}
          onStatusChange={loadDashboardData}
        />
      )}
    </div>
  );
}
