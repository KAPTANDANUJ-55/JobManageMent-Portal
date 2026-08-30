import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    inputClassName = '',
    id,
    disabled,
    required,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-ink-700 dark:text-ink-300 uppercase tracking-wider"
        >
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400 dark:text-ink-500">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'block w-full rounded-xl border text-sm transition-colors duration-150',
            'bg-white dark:bg-ink-900/80 text-ink-900 dark:text-ink-100 placeholder-ink-400 dark:placeholder-ink-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-ink-100 dark:disabled:bg-ink-800 disabled:text-ink-400 disabled:cursor-not-allowed',
            error
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600',
            leftIcon ? 'pl-10' : 'pl-3.5',
            rightIcon ? 'pr-10' : 'pr-3.5',
            'py-2.5',
            inputClassName
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-danger-600 dark:text-danger-400 font-medium animate-fade-in">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-ink-500 dark:text-ink-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
