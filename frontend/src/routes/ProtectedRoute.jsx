import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Skeleton from '@/components/ui/Skeleton';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-ink-50 dark:bg-ink-950">
        <div className="max-w-md w-full space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl mx-auto" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login preserving destination route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is logged in but unauthorized for this role section
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
