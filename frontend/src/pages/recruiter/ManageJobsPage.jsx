import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { jobsApi } from '@/api';
import {
  Briefcase,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { formatSalaryRange, timeAgo } from '@/utils/formatters';

export default function ManageJobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await jobsApi.getJobs({ recruiterId: user.id });
      setJobs(res.jobs || res || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'CLOSED' ? 'OPEN' : 'CLOSED';
    try {
      await jobsApi.updateJob(job.id, { status: nextStatus });
      toast.success(
        'Job Status Updated',
        `Job is now ${nextStatus === 'OPEN' ? 'Active / Open' : 'Closed'}`
      );
      loadJobs();
    } catch (err) {
      toast.error('Failed to update status', err.message);
    }
  };

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await jobsApi.deleteJob(jobId);
      toast.success('Job Deleted', `"${title}" has been removed.`);
      loadJobs();
    } catch (err) {
      toast.error('Delete Failed', err.message);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      (j.category && j.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return (j.status || 'OPEN') === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Create, edit, pause, and review candidate applicants across your job openings.
          </p>
        </div>

        <Link to="/recruiter/jobs/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post a New Job
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs font-semibold text-ink-800 dark:text-ink-200 focus:outline-none"
          >
            <option value="ALL">All Statuses ({jobs.length})</option>
            <option value="OPEN">Active Openings</option>
            <option value="CLOSED">Closed Jobs</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
            <h3 className="text-base font-bold text-ink-900 dark:text-white">
              No matching jobs found
            </h3>
            <p className="text-xs text-ink-500">Post a new job opening to start receiving candidates.</p>
            <Link to="/recruiter/jobs/new">
              <Button variant="primary" size="sm">
                Post Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Job Title & Category</th>
                  <th className="pb-3">Work Mode & Type</th>
                  <th className="pb-3">Salary Range</th>
                  <th className="pb-3">Candidates</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {filteredJobs.map((j) => {
                  const isClosed = j.status === 'CLOSED';
                  return (
                    <tr key={j.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                      <td className="py-4">
                        <Link to={`/jobs/${j.id}`} className="font-bold text-ink-900 dark:text-white hover:text-primary-600 truncate block max-w-xs">
                          {j.title}
                        </Link>
                        <span className="text-[11px] text-ink-400 font-medium">
                          {j.category} • {j.location}
                        </span>
                      </td>

                      <td className="py-4 text-ink-600 dark:text-ink-300">
                        {j.workMode} • {j.type}
                      </td>

                      <td className="py-4 font-semibold text-ink-800 dark:text-ink-200">
                        {formatSalaryRange(j.salaryMin, j.salaryMax)}
                      </td>

                      <td className="py-4">
                        <Link
                          to={`/recruiter/applicants?jobId=${j.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-xs hover:bg-primary-100"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {j.applicantCount || 0} applicants
                        </Link>
                      </td>

                      <td className="py-4">
                        <Badge tone={isClosed ? 'neutral' : 'success'} size="sm">
                          {isClosed ? 'Closed' : 'Active'}
                        </Badge>
                      </td>

                      <td className="py-4 text-ink-400">{timeAgo(j.createdAt)}</td>

                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/recruiter/applicants?jobId=${j.id}`}>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-ink-500 hover:text-primary-600 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                              title="Review Candidates (ATS)"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                          </Link>

                          <Link to={`/recruiter/jobs/${j.id}/edit`}>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-ink-500 hover:text-primary-600 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                              title="Edit Job"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(j)}
                            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                            title={isClosed ? 'Reopen Job' : 'Close Job'}
                          >
                            {isClosed ? <CheckCircle className="w-4 h-4 text-success-500" /> : <XCircle className="w-4 h-4 text-amber-500" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(j.id, j.title)}
                            className="p-1.5 rounded-lg text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/50 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
