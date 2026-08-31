import React, { useState } from 'react';
import { applicationsApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
} from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatters';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Textarea from '@/components/ui/Textarea';
import {
  Mail,
  Phone,
  FileText,
  Calendar,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function CandidateDetailModal({
  isOpen,
  onClose,
  application,
  onStatusChange,
}) {
  const { toast } = useToast();
  const [note, setNote] = useState(application?.recruiterNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const candidateName = application.candidateName || application.userName || 'Candidate';
  const statusTone = APPLICATION_STATUS_TONE[application.status] || 'neutral';
  const statusLabel = APPLICATION_STATUS_LABELS[application.status] || application.status;

  const handleUpdateStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      const updated = await applicationsApi.updateStatus(application.id, newStatus, note);
      toast.success(
        'Status Updated',
        `Candidate ${candidateName} moved to ${APPLICATION_STATUS_LABELS[newStatus] || newStatus}`
      );
      if (onStatusChange) {
        onStatusChange(updated);
      }
      onClose();
    } catch (err) {
      toast.error('Update Failed', err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusActions = [
    { status: APPLICATION_STATUS.IN_REVIEW, label: 'Mark In Review', variant: 'secondary' },
    { status: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlist', variant: 'primary' },
    { status: APPLICATION_STATUS.INTERVIEW, label: 'Invite to Interview', variant: 'primary' },
    { status: APPLICATION_STATUS.OFFERED, label: 'Extend Job Offer', variant: 'success' },
    { status: APPLICATION_STATUS.REJECTED, label: 'Reject Candidate', variant: 'danger' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Application Review"
      size="xl"
    >
      <div className="space-y-6">
        {/* Candidate Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-700/60">
          <div className="flex items-center gap-4">
            <Avatar name={candidateName} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink-900 dark:text-white">
                  {candidateName}
                </h3>
                <Badge tone={statusTone} size="sm">
                  {statusLabel}
                </Badge>
              </div>
              <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5">
                Applied for <span className="font-semibold text-ink-900 dark:text-white">{application.jobTitle}</span>
              </p>
              <p className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Submitted {formatDate(application.createdAt)} ({timeAgo(application.createdAt)})
              </p>
            </div>
          </div>

          {/* Quick Resume Link */}
          {application.resumeUrl && (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-ink-900 text-xs font-semibold text-primary-600 dark:text-primary-400 border border-ink-200 dark:border-ink-700 hover:border-primary-500 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              View Resume <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Contact Info & Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900/60 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-ink-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-ink-400 block uppercase font-bold">Email</span>
              <a
                href={`mailto:${application.candidateEmail}`}
                className="text-ink-800 dark:text-ink-200 font-medium hover:underline truncate block"
              >
                {application.candidateEmail || 'Not provided'}
              </a>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900/60 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-ink-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-ink-400 block uppercase font-bold">Phone</span>
              <span className="text-ink-800 dark:text-ink-200 font-medium truncate block">
                {application.candidatePhone || '+91 98765 43210'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900/60 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-ink-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-ink-400 block uppercase font-bold">Experience</span>
              <span className="text-ink-800 dark:text-ink-200 font-medium truncate block">
                {application.experienceYears ? `${application.experienceYears} Years` : '3+ Years'}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Note */}
        {application.coverNote && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
              Candidate Cover Note
            </h4>
            <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200/70 dark:border-ink-800 text-xs text-ink-700 dark:text-ink-300 leading-relaxed whitespace-pre-line">
              {application.coverNote}
            </div>
          </div>
        )}

        {/* Recruiter Review Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-primary-500" />
            Internal Hiring Team Notes & Feedback
          </label>
          <Textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal feedback, interview screening remarks, or notes for the hiring committee..."
          />
        </div>

        {/* Status Transition Actions */}
        <div className="space-y-3 pt-4 border-t border-ink-100 dark:border-ink-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
            Pipeline Stage Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {statusActions.map((action) => {
              const isCurrent = application.status === action.status;
              return (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="sm"
                  disabled={isUpdating || isCurrent}
                  onClick={() => handleUpdateStatus(action.status)}
                  className="text-xs"
                >
                  {isCurrent ? `Current: ${action.label}` : action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
