import React from 'react';
import { cn } from '@/utils/cn';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  tabClassName = '',
}) {
  return (
    <div className={cn('flex items-center gap-1.5 p-1 bg-ink-100 dark:bg-ink-800/80 rounded-xl overflow-x-auto scrollbar-none', className)}>
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : null;
        const icon = typeof tab === 'object' ? tab.icon : null;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150',
              isActive
                ? 'bg-white dark:bg-ink-900 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white',
              tabClassName
            )}
          >
            {icon && <span className="w-4 h-4">{icon}</span>}
            <span>{label}</span>
            {count !== null && count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                    : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
