import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { savedJobsApi } from '@/api';
import { BookmarkCheck } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import ApplyModal from '@/components/jobs/ApplyModal';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function SavedJobsPage() {
  const { user } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const loadSavedJobs = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await savedJobsApi.getSavedJobs(user.id);
      setSavedJobs(data || []);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Saved Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-ink-500 mt-1">
            Jobs you have bookmarked to review or apply for later.
          </p>
        </div>

        <Link to="/jobs">
          <Button variant="primary" size="md">
            Explore More Jobs
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-ink-900 rounded-3xl border border-ink-200 dark:border-ink-800 space-y-3">
          <BookmarkCheck className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
          <h3 className="text-base font-bold text-ink-900 dark:text-white">
            No saved jobs yet
          </h3>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it for quick access later.
          </p>
          <Link to="/jobs">
            <Button variant="primary" size="sm">
              Browse Open Roles
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSavedInitial={true}
              onSaveToggle={handleSaveToggle}
              onApplyClick={handleApplyClick}
            />
          ))}
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
