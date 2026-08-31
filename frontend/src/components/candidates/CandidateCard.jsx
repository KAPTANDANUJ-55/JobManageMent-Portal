import React from 'react';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from '@/utils/constants';
import { timeAgo } from '@/utils/formatters';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Mail, Phone, Clock, ExternalLink } from 'lucide-react';

export default function CandidateCard({
  application,
  onClick,
  className = '',
}) {
  const statusTone = APPLICATION_STATUS_TONE[application.status] || 'neutral';
  const statusLabel = APPLICATION_STATUS_LABELS[application.status] || application.status;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800 shadow-sm hover:shadow-card-hover hover:border-primary-300 dark:hover:border-primary-800 cursor-pointer transition-all duration-150 space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={application.candidateName || application.userName || 'Candidate'} size="sm" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-ink-900 dark:text-white truncate">
              {application.candidateName || application.userName}
            </h4>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 truncate">
              {application.jobTitle}
            </p>
          </div>
        </div>

        <Badge tone={statusTone} size="sm">
          {statusLabel}
        </Badge>
      </div>

      {application.coverNote && (
        <p className="text-[11px] text-ink-600 dark:text-ink-300 line-clamp-2 italic bg-ink-50 dark:bg-ink-800/40 p-2 rounded-lg">
          "{application.coverNote}"
        </p>
      )}

      <div className="flex items-center justify-between text-[10px] text-ink-400 pt-1 border-t border-ink-100 dark:border-ink-800/60">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(application.createdAt)}
        </span>
        {application.experienceYears && (
          <span>{application.experienceYears} yrs exp</span>
        )}
      </div>
    </div>
  );
}
