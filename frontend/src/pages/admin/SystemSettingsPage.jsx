import React, { useState } from 'react';
import { systemApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import { USE_MOCKS } from '@/api/client';
import {
  Settings,
  Database,
  RotateCcw,
  Server,
  ShieldCheck,
  Trash2,
  Cpu,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (!window.confirm('Reset the mock database to default demo seed data?')) {
      return;
    }

    try {
      setIsResetting(true);
      const res = await systemApi.resetDemoState();
      toast.success('Database Reset', res.message || 'Mock database restored.');
    } catch (err) {
      toast.error('Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearLocalStorage = () => {
    if (!window.confirm('Clear all localStorage caches and reload application?')) {
      return;
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
          System & Demo Architecture
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Inspect client-side mock storage, backend connection status, and demo reset facilities.
        </p>
      </div>

      {/* Backend / API Mode Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink-900 dark:text-white">
                API Integration Mode
              </h2>
              <p className="text-xs text-ink-500">
                Determined by <code className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-[11px] font-mono">VITE_USE_MOCKS</code> environment variable
              </p>
            </div>
          </div>

          <Badge tone={USE_MOCKS ? 'primary' : 'success'} size="md">
            {USE_MOCKS ? 'In-Browser Mock DB' : 'Spring Boot REST Mode'}
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-100 dark:border-ink-800 text-xs text-ink-700 dark:text-ink-300 space-y-2">
          <p className="leading-relaxed">
            All API calls flow through <code className="font-mono text-primary-600 font-bold">src/api/index.js</code>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-ink-600 dark:text-ink-400">
            <li>
              <strong>Mock Mode (Active):</strong> All mutations (new jobs, applications, status updates) persist directly to browser localStorage.
            </li>
            <li>
              <strong>Live Spring Boot Mode:</strong> Set <code className="font-mono">VITE_USE_MOCKS=false</code> in <code className="font-mono">.env</code> to proxy requests to <code className="font-mono">http://localhost:8080/api</code>.
            </li>
          </ul>
        </div>
      </div>

      {/* Demo Seed Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-warning-100 dark:bg-warning-950 text-warning-600 dark:text-warning-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Mock Database Seed Controller
            </h2>
            <p className="text-xs text-ink-500">
              Reset test companies, candidate applications, and job listings back to pristine starting states.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-ink-600 dark:text-ink-400">
            Re-populates 5 companies, 15 tech jobs, 20 sample candidate applications, and 3 demo accounts.
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={isResetting}
            onClick={handleResetDemo}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="shrink-0"
          >
            Reset Database Seed
          </Button>
        </div>
      </div>

      {/* Storage Cleaner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-danger-100 dark:bg-danger-950 text-danger-600 dark:text-danger-400 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Storage & Cache Flush
            </h2>
            <p className="text-xs text-ink-500">
              Clears auth tokens, notifications, and local state from browser storage.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-ink-500">
            Signs out the current user and purges all cached demo data.
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearLocalStorage}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Local Storage
          </Button>
        </div>
      </div>
    </div>
  );
}
