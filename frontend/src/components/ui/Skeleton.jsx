import React from 'react';
import { cn } from '@/utils/cn';

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-ink-200 dark:bg-ink-800 rounded-xl shimmer',
        className
      )}
      {...props}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3.5">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="w-20 h-6 rounded-lg" />
        <Skeleton className="w-24 h-6 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-ink-100 dark:border-ink-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="w-full h-4 rounded" />
        </td>
      ))}
    </tr>
  );
}
