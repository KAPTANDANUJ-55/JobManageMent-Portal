import React from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-danger-500 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-primary-500 shrink-0" />,
};

const toastBorders = {
  success: 'border-success-200 dark:border-success-800/50 bg-white dark:bg-ink-900',
  error: 'border-danger-200 dark:border-danger-800/50 bg-white dark:bg-ink-900',
  warning: 'border-warning-200 dark:border-warning-800/50 bg-white dark:bg-ink-900',
  info: 'border-primary-200 dark:border-primary-800/50 bg-white dark:bg-ink-900',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-dropdown',
            'transition-all duration-200 animate-slide-in-right',
            toastBorders[toast.type] || toastBorders.info
          )}
        >
          {toastIcons[toast.type] || toastIcons.info}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-sm font-semibold text-ink-900 dark:text-white leading-tight">
                {toast.title}
              </h4>
            )}
            {toast.message && (
              <p className="mt-0.5 text-xs text-ink-600 dark:text-ink-300 leading-relaxed break-words">
                {toast.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="p-1 -mr-1 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
