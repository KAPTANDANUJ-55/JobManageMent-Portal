import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { timeAgo } from '@/utils/formatters';
import { Link } from 'react-router-dom';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 focus:outline-none transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-ink-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-dropdown z-50 overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-ink-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-ink-100 dark:divide-ink-800/60 scrollbar-slim">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Inbox className="w-8 h-8 mx-auto text-ink-300 dark:text-ink-600 mb-2" />
                <p className="text-sm font-medium text-ink-600 dark:text-ink-400">
                  No notifications yet
                </p>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  We will notify you about your applications and job updates.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/50 cursor-pointer flex gap-3 ${
                    !item.read ? 'bg-primary-50/40 dark:bg-primary-950/20' : ''
                  }`}
                >
                  <div className="mt-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        !item.read ? 'bg-primary-600 ring-2 ring-primary-200 dark:ring-primary-900' : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-semibold text-ink-900 dark:text-ink-100 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-ink-400 shrink-0">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-600 dark:text-ink-300 mt-1 line-clamp-2">
                      {item.message}
                    </p>
                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 dark:text-primary-400 mt-2 hover:underline"
                      >
                        View details <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
