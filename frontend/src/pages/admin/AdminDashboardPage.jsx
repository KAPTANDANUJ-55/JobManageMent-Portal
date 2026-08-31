import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, systemApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  ShieldAlert,
  TrendingUp,
  Activity,
  RotateCcw,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all mock database data back to initial seed state?')) {
      return;
    }

    try {
      setIsResetting(true);
      await systemApi.resetDemoState();
      toast.success('Database Reset', 'Demo database reseeded to clean starting state.');
      loadStats();
    } catch (err) {
      toast.error('Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-ink-900 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-sm">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Analytics & Health
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 max-w-xl">
            Live overview of all user registrations, job postings across companies, application throughput, and system demo controls.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="white"
            size="md"
            isLoading={isResetting}
            onClick={handleResetDemo}
            leftIcon={<RotateCcw className="w-4 h-4 text-warning-600" />}
          >
            Reset Demo DB
          </Button>
          <Link to="/admin/users">
            <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers || '...'}
          icon={<Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
          changeLabel={`${stats?.seekers || 0} Seekers • ${stats?.recruiters || 0} Recruiters`}
        />
        <StatCard
          title="Total Job Postings"
          value={stats?.totalJobs || '...'}
          icon={<Briefcase className="w-5 h-5 text-info-600 dark:text-info-400" />}
          changeLabel={`${stats?.activeJobs || 0} active openings`}
        />
        <StatCard
          title="Applications Sent"
          value={stats?.totalApplications || '...'}
          icon={<FileText className="w-5 h-5 text-success-600 dark:text-success-400" />}
          changeLabel="Across all departments"
        />
        <StatCard
          title="Hiring Companies"
          value={stats?.totalCompanies || '...'}
          icon={<Building2 className="w-5 h-5 text-warning-600 dark:text-warning-400" />}
          changeLabel="Verified employer brands"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Applications Trend (Area Chart) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Application Throughput Trend
            </h2>
            <p className="text-xs text-ink-500">Monthly candidate application volume</p>
          </div>

          <div className="h-64 w-full">
            {stats?.monthlyTrends ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-2xl" />
            )}
          </div>
        </div>

        {/* Jobs by Category (Bar Chart) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Openings by Department
            </h2>
            <p className="text-xs text-ink-500">Distribution of live job listings</p>
          </div>

          <div className="h-64 w-full">
            {stats?.categoryStats ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-2xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
