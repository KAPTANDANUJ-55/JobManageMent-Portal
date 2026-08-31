import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { applicationsApi, jobsApi } from '@/api';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
  APPLICATION_PIPELINE,
} from '@/utils/constants';
import {
  Users,
  Search,
  Filter,
  Columns,
  List,
  Eye,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateDetailModal from '@/components/candidates/CandidateDetailModal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import { formatDate, timeAgo } from '@/utils/formatters';

const kanbanColumns = [
  { id: APPLICATION_STATUS.APPLIED, title: 'New Applied', color: 'bg-slate-500' },
  { id: APPLICATION_STATUS.IN_REVIEW, title: 'In Review', color: 'bg-blue-500' },
  { id: APPLICATION_STATUS.SHORTLISTED, title: 'Shortlisted', color: 'bg-indigo-500' },
  { id: APPLICATION_STATUS.INTERVIEW, title: 'Interview Stage', color: 'bg-amber-500' },
  { id: APPLICATION_STATUS.OFFERED, title: 'Offer Extended', color: 'bg-emerald-500' },
];

export default function ApplicantTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'ALL';

  const { user } = useAuth();
  const { toast } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('KANBAN'); // KANBAN or TABLE
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadData = useCallback(async () => {
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
      console.error('Failed to load ATS candidates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    if (jobId === 'ALL') {
      searchParams.delete('jobId');
    } else {
      searchParams.set('jobId', jobId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredApplicants = applicants.filter((app) => {
    if (selectedJobId !== 'ALL' && String(app.jobId) !== String(selectedJobId)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (app.candidateName || app.userName || '').toLowerCase();
      const job = (app.jobTitle || '').toLowerCase();
      return name.includes(q) || job.includes(q);
    }
    return true;
  });

  const handleCandidateClick = (app) => {
    setSelectedCandidate(app);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Applicant Tracking System (ATS)
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Pipeline board for reviewing candidate profiles, screening resumes, and advancing hiring stages.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700">
          <button
            type="button"
            onClick={() => setViewMode('KANBAN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'KANBAN'
                ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-sm'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Pipeline Board
          </button>
          <button
            type="button"
            onClick={() => setViewMode('TABLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'TABLE'
                ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-sm'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Table View
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Job selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink-400 uppercase tracking-wider shrink-0">
            Opening:
          </span>
          <select
            value={selectedJobId}
            onChange={(e) => handleJobSelect(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs font-semibold text-ink-800 dark:text-ink-100 focus:outline-none"
          >
            <option value="ALL">All Job Openings ({applicants.length} candidates)</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicantCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* View: Kanban vs Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : viewMode === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colApplicants = filteredApplicants.filter((a) => a.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-ink-100/60 dark:bg-ink-900/60 rounded-2xl p-3 border border-ink-200/70 dark:border-ink-800/80 space-y-3 min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="text-xs font-bold text-ink-900 dark:text-white truncate">
                      {col.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 shadow-sm">
                    {colApplicants.length}
                  </span>
                </div>

                {/* Candidate Cards in this Stage */}
                <div className="space-y-2.5 min-h-[160px]">
                  {colApplicants.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-ink-400">
                      No candidates in this stage
                    </div>
                  ) : (
                    colApplicants.map((app) => (
                      <CandidateCard
                        key={app.id}
                        application={app}
                        onClick={() => handleCandidateClick(app)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Applied Job</th>
                  <th className="pb-3">Experience</th>
                  <th className="pb-3">Status Stage</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.candidateName || app.userName} size="sm" />
                        <div>
                          <p className="font-bold text-ink-900 dark:text-white">
                            {app.candidateName || app.userName}
                          </p>
                          <p className="text-[11px] text-ink-400">{app.candidateEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 font-semibold text-ink-800 dark:text-ink-200">
                      {app.jobTitle}
                    </td>

                    <td className="py-4 text-ink-600 dark:text-ink-300">
                      {app.experienceYears ? `${app.experienceYears} Years` : '3+ Years'}
                    </td>

                    <td className="py-4">
                      <Badge tone={APPLICATION_STATUS_TONE[app.status] || 'neutral'} size="sm">
                        {APPLICATION_STATUS_LABELS[app.status] || app.status}
                      </Badge>
                    </td>

                    <td className="py-4 text-ink-400">{timeAgo(app.createdAt)}</td>

                    <td className="py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCandidateClick(app)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs"
                      >
                        Review Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          application={selectedCandidate}
          onStatusChange={loadData}
        />
      )}
    </div>
  );
}
