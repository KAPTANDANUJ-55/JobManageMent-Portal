import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { companiesApi, jobsApi } from '@/api';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Star,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import JobCard from '@/components/jobs/JobCard';
import ApplyModal from '@/components/jobs/ApplyModal';
import Tabs from '@/components/ui/Tabs';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadCompanyDetails() {
      try {
        setIsLoading(true);
        const [compData, jobsRes] = await Promise.all([
          companiesApi.getCompanyById(id),
          jobsApi.getJobs({ companyId: id }),
        ]);

        if (!compData) {
          navigate('/not-found');
          return;
        }

        setCompany(compData);
        setOpenJobs(jobsRes.jobs || jobsRes || []);
      } catch (err) {
        console.error('Failed to load company details:', err);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanyDetails();
  }, [id, navigate]);

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <div className="p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!company) return null;

  const tabs = [
    { id: 'jobs', label: `Open Positions (${openJobs.length})` },
    { id: 'about', label: 'About & Culture' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all companies
      </Link>

      {/* Company Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <Avatar name={company.name} size="xl" className="rounded-3xl shrink-0 ring-4 ring-ink-100 dark:ring-ink-800" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
                  {company.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {company.rating || '4.5'}
                </span>
              </div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {company.industry}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ink-400" />
                  {company.location || 'India'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-ink-400" />
                  {company.size || '100-500 employees'}
                </span>
              </div>
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 hover:border-primary-500 text-xs font-bold text-ink-800 dark:text-ink-100 transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4 text-primary-500" />
              Visit Company Website
              <ExternalLink className="w-3.5 h-3.5 text-ink-400" />
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'jobs' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Open Positions at {company.name}
            </h2>
            <span className="text-xs font-semibold text-ink-500">
              {openJobs.length} active {openJobs.length === 1 ? 'opening' : 'openings'}
            </span>
          </div>

          {openJobs.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-ink-900 rounded-3xl border border-ink-200 dark:border-ink-800 space-y-2">
              <Briefcase className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
              <h3 className="text-base font-bold text-ink-900 dark:text-white">
                No current open positions
              </h3>
              <p className="text-xs text-ink-500">
                Check back soon or explore other companies hiring on JobHub.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {openJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={handleApplyClick}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-ink-900 dark:text-white">
              About {company.name}
            </h2>
            <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed whitespace-pre-line">
              {company.about}
            </p>
          </div>

          <div className="pt-6 border-t border-ink-100 dark:border-ink-800 space-y-3">
            <h3 className="text-sm font-bold text-ink-900 dark:text-white">
              Company Overview & Culture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
                <span className="text-ink-400 font-bold uppercase tracking-wider block">Industry</span>
                <span className="text-ink-900 dark:text-white font-semibold mt-1 block">
                  {company.industry}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
                <span className="text-ink-400 font-bold uppercase tracking-wider block">Headquarters</span>
                <span className="text-ink-900 dark:text-white font-semibold mt-1 block">
                  {company.location || 'Bengaluru, India'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
                <span className="text-ink-400 font-bold uppercase tracking-wider block">Company Size</span>
                <span className="text-ink-900 dark:text-white font-semibold mt-1 block">
                  {company.size || '250-500 employees'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
