import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { applicationsApi } from '@/api';
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
  APPLICATION_PIPELINE,
} from '@/utils/constants';
import { formatDate, timeAgo } from '@/utils/formatters';
import {
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  Eye,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadApplications = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await applicationsApi.getMyApplications(user.id);
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      setIsWithdrawing(true);
      await applicationsApi.withdraw(user.id, applicationId);
      toast.success('Application Withdrawn', 'Your application was withdrawn.');
      setIsModalOpen(false);
      loadApplications();
    } catch (err) {
      toast.error('Withdraw Failed', err.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: `All (${applications.length})` },
    {
      id: APPLICATION_STATUS.IN_REVIEW,
      label: `In Review (${applications.filter((a) => a.status === APPLICATION_STATUS.IN_REVIEW || a.status === APPLICATION_STATUS.APPLIED).length})`,
    },
    {
      id: APPLICATION_STATUS.SHORTLISTED,
      label: `Shortlisted (${applications.filter((a) => a.status === APPLICATION_STATUS.SHORTLISTED).length})`,
    },
    {
      id: APPLICATION_STATUS.INTERVIEW,
      label: `Interview (${applications.filter((a) => a.status === APPLICATION_STATUS.INTERVIEW).length})`,
    },
    {
      id: APPLICATION_STATUS.OFFERED,
      label: `Offered (${applications.filter((a) => a.status === APPLICATION_STATUS.OFFERED).length})`,
    },
  ];

  const filtered = applications.filter((app) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === APPLICATION_STATUS.IN_REVIEW) {
      return app.status === APPLICATION_STATUS.IN_REVIEW || app.status === APPLICATION_STATUS.APPLIED;
    }
    return app.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Track and monitor the status of every application you have submitted.
          </p>
        </div>

        <Link to="/jobs">
          <Button variant="primary" size="md">
            Find More Jobs
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeFilter} onChange={setActiveFilter} />

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-ink-900 rounded-3xl border border-ink-200 dark:border-ink-800 space-y-3">
          <FileText className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
          <h3 className="text-base font-bold text-ink-900 dark:text-white">
            No applications in this stage
          </h3>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            Ready to explore exciting opportunities? Browse thousands of open engineering roles now.
          </p>
          <Link to="/jobs">
            <Button variant="primary" size="sm">
              Search Open Roles
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const tone = APPLICATION_STATUS_TONE[app.status] || 'neutral';
            const label = APPLICATION_STATUS_LABELS[app.status] || app.status;

            return (
              <div
                key={app.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={app.companyName || 'Company'} size="lg" className="rounded-2xl shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-ink-900 dark:text-white">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                        {app.companyName}
                      </p>
                      <p className="text-[11px] text-ink-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Submitted on {formatDate(app.createdAt)} ({timeAgo(app.createdAt)})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge tone={tone} size="lg">
                      {label}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApp(app);
                        setIsModalOpen(true);
                      }}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Details
                    </Button>
                  </div>
                </div>

                {/* Pipeline Progression Stepper */}
                <div className="pt-4 border-t border-ink-100 dark:border-ink-800/80">
                  <div className="flex items-center justify-between text-xs text-ink-500 font-semibold mb-2">
                    <span>Application Pipeline</span>
                    <span className="text-ink-400 font-normal">Status: {label}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {APPLICATION_PIPELINE.map((stage, idx) => {
                      const stageIdx = APPLICATION_PIPELINE.indexOf(app.status);
                      const isCompleted = stageIdx >= idx;
                      const isCurrent = app.status === stage;

                      return (
                        <div key={stage} className="space-y-1">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full transition-colors ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-primary-600 animate-pulse'
                                  : 'bg-primary-500'
                                : 'bg-ink-100 dark:bg-ink-800'
                            }`}
                          />
                          <span
                            className={`block text-[10px] sm:text-[11px] truncate text-center ${
                              isCurrent
                                ? 'font-bold text-primary-600 dark:text-primary-400'
                                : isCompleted
                                ? 'font-semibold text-ink-700 dark:text-ink-200'
                                : 'text-ink-400'
                            }`}
                          >
                            {APPLICATION_STATUS_LABELS[stage]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Application Details - ${selectedApp.jobTitle}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-700">
              <div>
                <h4 className="text-sm font-bold text-ink-900 dark:text-white">
                  {selectedApp.companyName}
                </h4>
                <p className="text-xs text-ink-500">
                  Applied on {formatDate(selectedApp.createdAt)}
                </p>
              </div>
              <Badge tone={APPLICATION_STATUS_TONE[selectedApp.status] || 'neutral'} size="md">
                {APPLICATION_STATUS_LABELS[selectedApp.status] || selectedApp.status}
              </Badge>
            </div>

            {selectedApp.resumeUrl && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Attached Resume
                </span>
                <div>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedApp.resumeUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {selectedApp.coverNote && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Your Cover Note
                </span>
                <p className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                  {selectedApp.coverNote}
                </p>
              </div>
            )}

            {selectedApp.recruiterNotes && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Hiring Team Feedback / Update
                </span>
                <p className="p-3.5 rounded-xl bg-primary-50/50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900 text-xs text-primary-900 dark:text-primary-200 leading-relaxed">
                  {selectedApp.recruiterNotes}
                </p>
              </div>
            )}

            {selectedApp.status !== APPLICATION_STATUS.WITHDRAWN &&
              selectedApp.status !== APPLICATION_STATUS.REJECTED && (
                <div className="pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
                  <p className="text-xs text-ink-400">Need to cancel your candidacy?</p>
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={isWithdrawing}
                    onClick={() => handleWithdraw(selectedApp.id)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Withdraw Application
                  </Button>
                </div>
              )}
          </div>
        </Modal>
      )}
    </div>
  );
}
