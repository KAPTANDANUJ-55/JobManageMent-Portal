import React from 'react';
import { cn } from '@/utils/cn';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const iconColors = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/80 dark:text-primary-400',
  success: 'bg-success-50 text-success-600 dark:bg-emerald-950/80 dark:text-emerald-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-amber-950/80 dark:text-amber-400',
  info: 'bg-info-50 text-info-600 dark:bg-blue-950/80 dark:text-blue-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400',
};

export default function StatCard({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  description,
  color = 'primary',
  className = '',
}) {
  return (
    <Card className={cn('relative overflow-hidden', className)} padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              'p-3 rounded-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105',
              iconColors[color] || iconColors.primary
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-semibold',
                changeType === 'increase'
                  ? 'bg-success-50 text-success-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : changeType === 'decrease'
                  ? 'bg-danger-50 text-danger-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300'
              )}
            >
              {changeType === 'increase' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : changeType === 'decrease' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              {change}
            </span>
          )}
          {description && (
            <span className="text-ink-500 dark:text-ink-400 truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
