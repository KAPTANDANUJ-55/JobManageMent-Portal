import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import { Shield, Search, Trash2, ExternalLink, Briefcase, Zap } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { formatSalaryRange, timeAgo } from '@/utils/formatters';

export default function JobModerationPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const res = await jobsApi.getJobs({ limit: 100 });
      setJobs(res.jobs || res || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Moderate and delete listing "${title}" from platform?`)) {
      return;
    }

    try {
      await jobsApi.deleteJob(jobId);
      toast.success('Job Removed', `"${title}" has been deleted from platform.`);
      loadJobs();
    } catch (err) {
      toast.error('Failed to delete job', err.message);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
          Job Moderation Center
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Review live job openings across all employers and manage platform content quality.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-xs text-ink-500 py-12 text-center">No jobs found matching criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Job Listing</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Salary</th>
                  <th className="pb-3">Applicants</th>
                  <th className="pb-3">Posted</th>
                  <th className="pb-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                    <td className="py-3.5">
                      <Link
                        to={`/jobs/${j.id}`}
                        target="_blank"
                        className="font-bold text-ink-900 dark:text-white hover:text-primary-600 truncate block max-w-xs"
                      >
                        {j.title}
                      </Link>
                      <span className="text-[11px] text-ink-400">
                        {j.category} • {j.workMode}
                      </span>
                    </td>

                    <td className="py-3.5 text-ink-700 dark:text-ink-300 font-semibold">
                      {j.companyName}
                    </td>

                    <td className="py-3.5 font-semibold text-ink-800 dark:text-ink-200">
                      {formatSalaryRange(j.salaryMin, j.salaryMax)}
                    </td>

                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-[11px] font-bold">
                        {j.applicantCount || 0}
                      </span>
                    </td>

                    <td className="py-3.5 text-ink-400">{timeAgo(j.createdAt)}</td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/jobs/${j.id}`} target="_blank">
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-ink-500 hover:text-primary-600 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                            title="View Public Post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(j.id, j.title)}
                          className="p-1.5 rounded-lg text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
                          title="Delete / Moderate Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
