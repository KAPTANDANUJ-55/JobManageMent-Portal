import React from 'react';
import {
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
  CATEGORIES,
} from '@/utils/constants';
import { Filter, RotateCcw, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function JobFilters({
  filters,
  onChange,
  onReset,
  className = '',
  isMobileDrawer = false,
  onCloseMobile = () => {},
}) {
  const handleCategoryChange = (cat) => {
    onChange({
      ...filters,
      category: filters.category === cat ? '' : cat,
      page: 1,
    });
  };

  const handleTypeChange = (type) => {
    onChange({
      ...filters,
      type: filters.type === type ? '' : type,
      page: 1,
    });
  };

  const handleWorkModeChange = (mode) => {
    onChange({
      ...filters,
      workMode: filters.workMode === mode ? '' : mode,
      page: 1,
    });
  };

  const handleExperienceChange = (exp) => {
    onChange({
      ...filters,
      experienceLevel: filters.experienceLevel === exp ? '' : exp,
      page: 1,
    });
  };

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.type) ||
    Boolean(filters.workMode) ||
    Boolean(filters.experienceLevel) ||
    Boolean(filters.minSalary);

  return (
    <div
      className={`bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/90 dark:border-ink-800/80 p-5 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-500" />
          <h3 className="text-sm font-bold text-ink-900 dark:text-white">Filter Openings</h3>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Work Mode */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
          Work Mode
        </label>
        <div className="space-y-1.5">
          {WORK_MODES.map((mode) => {
            const isChecked = filters.workMode === mode;
            return (
              <label
                key={mode}
                className="flex items-center gap-2.5 text-xs text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white cursor-pointer py-1 select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleWorkModeChange(mode)}
                  className="rounded text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
                />
                <span>{mode}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
          Employment Type
        </label>
        <div className="space-y-1.5">
          {JOB_TYPES.map((t) => {
            const isChecked = filters.type === t;
            return (
              <label
                key={t}
                className="flex items-center gap-2.5 text-xs text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white cursor-pointer py-1 select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTypeChange(t)}
                  className="rounded text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
                />
                <span>{t}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((exp) => {
            const isChecked = filters.experienceLevel === exp;
            return (
              <label
                key={exp}
                className="flex items-center gap-2.5 text-xs text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white cursor-pointer py-1 select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleExperienceChange(exp)}
                  className="rounded text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
                />
                <span>{exp}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Category */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-700 dark:text-ink-300">
          Department / Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-slim pr-1">
          {CATEGORIES.map((cat) => {
            const isChecked = filters.category === cat;
            return (
              <label
                key={cat}
                className="flex items-center gap-2.5 text-xs text-ink-700 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white cursor-pointer py-1 select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
                />
                <span className="truncate">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {isMobileDrawer && (
        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
          <Button variant="primary" size="md" className="w-full" onClick={onCloseMobile}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
