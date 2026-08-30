import React from 'react';
import { cn } from '@/utils/cn';

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  bordered = true,
  padding = 'md',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-ink-900/90 rounded-2xl transition-all duration-200',
        bordered && 'border border-ink-200/80 dark:border-ink-800 shadow-card',
        hover &&
          'hover:border-primary-300 dark:hover:border-primary-700/60 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={cn('text-lg font-bold text-ink-900 dark:text-white leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={cn('text-sm text-ink-500 dark:text-ink-400', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={cn('flex items-center pt-4 border-t border-ink-100 dark:border-ink-800/80', className)} {...props}>
      {children}
    </div>
  );
}
