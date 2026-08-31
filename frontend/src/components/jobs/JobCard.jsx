import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { savedJobsApi } from '@/api';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Zap,
  Building2,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { formatSalaryRange, timeAgo } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

export default function JobCard({
  job,
  isSavedInitial = false,
  onApplyClick,
  onSaveToggle,
  showApplyButton = true,
  className = '',
}) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Sign In Required', 'Please sign in as a Job Seeker to save jobs.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await savedJobsApi.toggleSaveJob(user.id, job.id);
      setIsSaved(res.saved);
      if (onSaveToggle) onSaveToggle(job.id, res.saved);
      toast.success(
        res.saved ? 'Job Saved' : 'Job Removed',
        res.saved
          ? `Saved "${job.title}" to your bookmarks.`
          : `Removed "${job.title}" from your bookmarks.`
      );
    } catch (err) {
      toast.error('Action Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onApplyClick) {
      onApplyClick(job);
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-ink-900 rounded-2xl p-5 sm:p-6 border border-ink-200/90 dark:border-ink-800/80 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      {/* Top row: Logo, Title, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <Link to={`/companies/${job.companyId || 1}`} className="shrink-0 group/logo">
              <Avatar
                name={job.companyName || 'Company'}
                size="md"
                className="ring-1 ring-ink-200/60 dark:ring-ink-700/60 rounded-xl group-hover/logo:scale-105 transition-transform"
              />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/companies/${job.companyId || 1}`}
                  className="text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-400 truncate"
                >
                  {job.companyName}
                </Link>
                {job.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>

              <Link to={`/jobs/${job.id}`} className="block mt-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark toggle */}
          <button
            type="button"
            onClick={handleSaveToggle}
            disabled={isSaving}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              isSaved
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                : 'bg-transparent border-transparent hover:border-ink-200 dark:hover:border-ink-700 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200'
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 fill-primary-600 dark:fill-primary-400" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Metadata Badges & Location */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 font-medium">
            <MapPin className="w-3.5 h-3.5 text-ink-400" />
            {job.location || 'India'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-ink-400" />
            {job.type}
          </span>
          {job.workMode && (
            <Badge
              tone={
                job.workMode === 'Remote'
                  ? 'success'
                  : job.workMode === 'Hybrid'
                  ? 'info'
                  : 'neutral'
              }
              size="sm"
            >
              {job.workMode}
            </Badge>
          )}
          {job.experienceLevel && (
            <span className="px-2 py-0.5 text-xs text-ink-500 font-medium">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Required Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-ink-50 dark:bg-ink-800/60 text-ink-600 dark:text-ink-300 border border-ink-200/60 dark:border-ink-700/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] font-medium text-ink-400">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Salary, Posted Date, Apply / View Button */}
      <div className="mt-5 pt-4 border-t border-ink-100 dark:border-ink-800/80 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-ink-900 dark:text-white">
            {formatSalaryRange(job.salaryMin, job.salaryMax)}
          </p>
          <p className="text-[11px] text-ink-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {timeAgo(job.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showApplyButton && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleApplyClick}
              className="text-xs font-semibold"
            >
              Quick Apply
            </Button>
          )}
          <Link to={`/jobs/${job.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label={`View details for ${job.title}`}
            >
              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
