import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { getHomeRoute } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-danger-100 dark:bg-danger-950 text-danger-600 dark:text-danger-400 shadow-inner mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-ink-600 dark:text-ink-400">
            You do not have the required permissions or role to view this portal area.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={getHomeRoute()}>
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Go to My Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Public Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
