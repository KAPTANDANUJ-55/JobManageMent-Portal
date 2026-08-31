import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi, savedJobsApi, companiesApi } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  BookmarkCheck,
  Share2,
  Building2,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  ArrowLeft,
  Zap,
  Globe,
  ExternalLink,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ApplyModal from '@/components/jobs/ApplyModal';
import { formatSalaryRange, formatDate, timeAgo } from '@/utils/formatters';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setIsLoading(true);
        const jobData = await jobsApi.getJobById(id);
        if (!jobData) {
          navigate('/not-found', { replace: true });
          return;
        }
        setJob(jobData);

        // Fetch company and saved status in parallel
        const promises = [
          jobData.companyId ? companiesApi.getCompanyById(jobData.companyId) : Promise.resolve(null),
          jobsApi.getJobs({ category: jobData.category, limit: 4 }),
        ];

        if (isAuthenticated && user) {
          promises.push(savedJobsApi.checkJobSaved(user.id, jobData.id));
        }

        const [compData, similarRes, savedStatus] = await Promise.all(promises);
        setCompany(compData);
        setSimilarJobs((similarRes?.jobs || []).filter((j) => j.id !== jobData.id).slice(0, 3));
        if (savedStatus) setIsSaved(savedStatus.saved);
      } catch (err) {
        console.error('Failed to load job details:', err);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    }
    loadJobDetails();
  }, [id, isAuthenticated, user, navigate]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Sign In Required', 'Please sign in to save this job.');
      return;
    }

    try {
      const res = await savedJobsApi.toggleSaveJob(user.id, job.id);
      setIsSaved(res.saved);
      toast.success(
        res.saved ? 'Job Saved' : 'Job Removed',
        res.saved ? 'Added to your bookmarked jobs' : 'Removed from bookmarks'
      );
    } catch (err) {
      toast.error('Failed to update bookmark', err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link Copied', 'Job link copied to clipboard.');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <div className="p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) return null;

  const paragraphs = job.description ? job.description.split('\n\n') : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all jobs
      </Link>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={job.companyName} size="xl" className="rounded-2xl shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/companies/${job.companyId}`}
                  className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {job.companyName}
                </Link>
                {job.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Featured Job
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
                {job.title}
              </h1>
              <p className="text-xs text-ink-500 flex items-center gap-2 pt-1">
                <span>Posted {timeAgo(job.createdAt)}</span>
                <span>•</span>
                <span>{job.applicantCount || 0} applicants so far</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`p-3 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                  : 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-700 text-ink-500 hover:text-ink-900 dark:hover:text-white'
              }`}
              title={isSaved ? 'Remove from bookmarks' : 'Bookmark job'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 fill-primary-600 dark:fill-primary-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-3 rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-500 hover:text-ink-900 dark:hover:text-white transition-all"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsApplyModalOpen(true)}
              className="flex-1 md:flex-initial px-8 font-bold"
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-ink-100 dark:border-ink-800">
          <div className="p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">
              Salary Range
            </span>
            <span className="text-sm font-bold text-ink-900 dark:text-white mt-0.5 block">
              {formatSalaryRange(job.salaryMin, job.salaryMax)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">
              Location / Mode
            </span>
            <span className="text-sm font-bold text-ink-900 dark:text-white mt-0.5 block truncate">
              {job.location} ({job.workMode})
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">
              Job Type
            </span>
            <span className="text-sm font-bold text-ink-900 dark:text-white mt-0.5 block">
              {job.type}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-400 block">
              Experience
            </span>
            <span className="text-sm font-bold text-ink-900 dark:text-white mt-0.5 block">
              {job.experienceLevel || 'Mid-Senior'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Description & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About the Role */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">About the Role</h2>
            <div className="space-y-4 text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Required Skills & Technologies */}
          {job.skills && job.skills.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-ink-900 dark:text-white">Required Skills & Stack</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold text-xs border border-primary-200/60 dark:border-primary-800/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What We Offer / Perks */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">Benefits & Perks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-700 dark:text-ink-300">
              {[
                'Competitive compensation + stock options (ESOPs)',
                'Comprehensive health insurance for self & family',
                'Flexible remote / hybrid work policies',
                'Annual learning & development allowance',
                'Wellness stipend & home office setup budget',
                'Paid time off + parental leave',
              ].map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-6 sticky top-24">
          {/* Company Card */}
          {company && (
            <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={company.name} size="lg" className="rounded-xl" />
                <div>
                  <h3 className="text-base font-bold text-ink-900 dark:text-white">
                    {company.name}
                  </h3>
                  <p className="text-xs text-ink-500">{company.industry}</p>
                </div>
              </div>

              <p className="text-xs text-ink-600 dark:text-ink-300 line-clamp-3 leading-relaxed">
                {company.about}
              </p>

              <div className="pt-2 border-t border-ink-100 dark:border-ink-800 space-y-2 text-xs text-ink-600 dark:text-ink-300">
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Team Size</span>
                  <span className="font-semibold">{company.size || '100-500'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Location</span>
                  <span className="font-semibold">{company.location}</span>
                </div>
                {company.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-ink-400">Website</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <Link to={`/companies/${company.id}`} className="block pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Company Profile
                </Button>
              </Link>
            </div>
          )}

          {/* Similar Jobs Widget */}
          {similarJobs.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white">
                Similar Openings in {job.category}
              </h3>
              <div className="space-y-3">
                {similarJobs.map((simJob) => (
                  <Link
                    key={simJob.id}
                    to={`/jobs/${simJob.id}`}
                    className="group block p-3 rounded-2xl bg-ink-50 dark:bg-ink-950/60 hover:bg-primary-50/50 dark:hover:bg-primary-950/40 border border-ink-100 dark:border-ink-800 transition-colors"
                  >
                    <h4 className="text-xs font-bold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                      {simJob.title}
                    </h4>
                    <p className="text-[11px] text-ink-500 truncate mt-0.5">
                      {simJob.companyName} • {simJob.location}
                    </p>
                    <p className="text-[11px] font-semibold text-ink-700 dark:text-ink-300 mt-1">
                      {formatSalaryRange(simJob.salaryMin, simJob.salaryMax)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
      />
    </div>
  );
}
