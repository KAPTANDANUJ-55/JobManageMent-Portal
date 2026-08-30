import React from 'react';
import { cn } from '@/utils/cn';

const tones = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border-primary-200/60 dark:border-primary-800/40',
  success: 'bg-success-50 text-success-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-success-200/60 dark:border-emerald-800/40',
  warning: 'bg-warning-50 text-warning-700 dark:bg-amber-950/60 dark:text-amber-300 border-warning-200/60 dark:border-amber-800/40',
  danger: 'bg-danger-50 text-danger-700 dark:bg-rose-950/60 dark:text-rose-300 border-danger-200/60 dark:border-rose-800/40',
  info: 'bg-info-50 text-info-700 dark:bg-blue-950/60 dark:text-blue-300 border-info-200/60 dark:border-blue-800/40',
  neutral: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
};

const dotColors = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
  neutral: 'bg-ink-400',
  purple: 'bg-purple-500',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-lg border tracking-wide select-none',
        tones[tone] || tones.neutral,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[tone] || dotColors.neutral)}
        />
      )}
      {children}
    </span>
  );
}
