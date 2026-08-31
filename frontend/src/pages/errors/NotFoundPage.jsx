import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-extrabold text-3xl shadow-inner">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-ink-600 dark:text-ink-400">
            The page or job listing you are looking for might have been moved, expired, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="md" leftIcon={<Search className="w-4 h-4" />}>
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
