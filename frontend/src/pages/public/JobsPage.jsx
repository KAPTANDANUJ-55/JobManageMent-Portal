import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsApi } from '@/api';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, X, Inbox } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import ApplyModal from '@/components/jobs/ApplyModal';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { PAGE_SIZE } from '@/utils/constants';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    workMode: searchParams.get('mode') || '',
    experienceLevel: searchParams.get('exp') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Sync state to URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.search) p.set('q', filters.search);
    if (filters.location) p.set('location', filters.location);
    if (filters.category) p.set('category', filters.category);
    if (filters.type) p.set('type', filters.type);
    if (filters.workMode) p.set('mode', filters.workMode);
    if (filters.experienceLevel) p.set('exp', filters.experienceLevel);
    if (filters.sort !== 'newest') p.set('sort', filters.sort);
    if (filters.page > 1) p.set('page', String(filters.page));
    setSearchParams(p, { replace: true });
  }, [filters, setSearchParams]);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await jobsApi.getJobs({
        search: filters.search,
        location: filters.location,
        category: filters.category,
        type: filters.type,
        workMode: filters.workMode,
        experienceLevel: filters.experienceLevel,
        sort: filters.sort,
        page: filters.page,
        limit: PAGE_SIZE,
      });

      setJobs(res.jobs || []);
      setTotalCount(res.total || res.jobs?.length || 0);
      setTotalPages(res.totalPages || Math.ceil((res.total || res.jobs?.length || 0) / PAGE_SIZE) || 1);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      type: '',
      workMode: '',
      experienceLevel: '',
      sort: 'newest',
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'salary_high', label: 'Highest Salary' },
    { value: 'relevance', label: 'Most Relevant' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, tech stack, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Location Search */}
          <div className="w-full md:w-64 relative">
            <MapPin className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Location (e.g. Bengaluru)"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value, page: 1 }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.category || filters.workMode || filters.type || filters.experienceLevel) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink-100 dark:border-ink-800 text-xs">
            <span className="text-ink-400 font-semibold">Active Filters:</span>
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium">
                {filters.category}
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, category: '', page: 1 }))}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.workMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium">
                {filters.workMode}
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, workMode: '', page: 1 }))}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium">
                {filters.type}
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, type: '', page: 1 }))}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.experienceLevel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium">
                {filters.experienceLevel}
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, experienceLevel: '', page: 1 }))}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary-600 dark:text-primary-400 hover:underline font-semibold ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <JobFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Jobs List Canvas */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header row with count & sort */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-900 dark:text-white">
              Showing <span className="text-primary-600 dark:text-primary-400">{totalCount}</span> openings
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink-400 hidden sm:inline">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))}
                className="px-3 py-1.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-xs font-semibold text-ink-800 dark:text-ink-100 focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Cards */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-3"
                >
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 space-y-3">
              <Inbox className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
              <h3 className="text-base font-bold text-ink-900 dark:text-white">
                No matching jobs found
              </h3>
              <p className="text-xs text-ink-500 max-w-sm mx-auto">
                Try widening your search terms, changing the location, or clearing applied filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={handleApplyClick}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-80 max-w-xs bg-white dark:bg-ink-900 h-full overflow-y-auto z-10 p-4 shadow-2xl">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              isMobileDrawer
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
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
