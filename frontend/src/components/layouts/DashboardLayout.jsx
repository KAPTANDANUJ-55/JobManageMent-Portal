import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_LABELS } from '@/utils/constants';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  User,
  PlusCircle,
  Users,
  Building2,
  Shield,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Signed out', 'You have been logged out.');
    navigate('/login');
  };

  // Nav menus by role
  const seekerNav = [
    { label: 'Overview', to: '/seeker', icon: LayoutDashboard, end: true },
    { label: 'My Applications', to: '/seeker/applications', icon: FileText },
    { label: 'Saved Jobs', to: '/seeker/saved', icon: BookmarkCheck },
    { label: 'Profile & Resume', to: '/seeker/profile', icon: User },
  ];

  const recruiterNav = [
    { label: 'Overview', to: '/recruiter', icon: LayoutDashboard, end: true },
    { label: 'Manage Jobs', to: '/recruiter/jobs', icon: Briefcase },
    { label: 'Post a New Job', to: '/recruiter/jobs/new', icon: PlusCircle, highlight: true },
    { label: 'Applicant Pipeline', to: '/recruiter/applicants', icon: Users },
    { label: 'Company Profile', to: '/recruiter/company', icon: Building2 },
  ];

  const adminNav = [
    { label: 'Analytics Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'User Directory', to: '/admin/users', icon: Users },
    { label: 'Job Moderation', to: '/admin/jobs', icon: Shield },
    { label: 'System & Demo Tools', to: '/admin/settings', icon: Settings },
  ];

  const currentNav =
    role === ROLES.ADMIN ? adminNav : role === ROLES.RECRUITER ? recruiterNav : seekerNav;

  const roleBadgeColor =
    role === ROLES.ADMIN ? 'warning' : role === ROLES.RECRUITER ? 'success' : 'primary';

  return (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-950 text-ink-800 dark:text-ink-100 transition-colors">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-ink-200/80 dark:border-ink-800/80 bg-white dark:bg-ink-900 transition-all duration-300 z-30 sticky top-0 h-screen',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-ink-100 dark:border-ink-800">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-primary-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-ink-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
                  JobHub
                </span>
                <span className="text-[9px] uppercase tracking-widest text-ink-400 font-bold -mt-1">
                  {role ? ROLE_LABELS[role] : 'Portal'}
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-slim">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-primary-600 text-white font-semibold shadow-sm shadow-primary-600/20'
                      : item.highlight
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                      : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white',
                    collapsed ? 'justify-center px-0' : ''
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-ink-100 dark:border-ink-800">
            <Link
              to="/jobs"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors',
                collapsed ? 'justify-center px-0' : ''
              )}
              title={collapsed ? 'Browse Public Jobs' : undefined}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Public Job Board</span>}
            </Link>
          </div>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-3 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
          <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
            <Avatar name={user?.name || 'User'} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-ink-400 truncate">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-ink-400 hover:text-danger-600 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-ink-200/80 dark:border-ink-800/80 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 md:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Current Route Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider hidden sm:inline">
                Portal
              </span>
              <span className="text-ink-300 hidden sm:inline">/</span>
              <Badge tone={roleBadgeColor} size="sm">
                {ROLE_LABELS[role] || 'User'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === ROLES.RECRUITER && (
              <Link to="/recruiter/jobs/new" className="hidden sm:inline-flex">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Job
                </button>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-warning-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Center */}
            <NotificationDropdown />

            {/* Profile Avatar */}
            <Link
              to={role === ROLES.SEEKER ? '/seeker/profile' : role === ROLES.RECRUITER ? '/recruiter/company' : '/admin/settings'}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary-500/30 transition-all"
              title="View Profile / Settings"
            >
              <Avatar name={user?.name || 'User'} size="sm" />
            </Link>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-xs bg-white dark:bg-ink-900 h-full flex flex-col shadow-2xl z-10 animate-slide-in-right">
            <div className="h-16 flex items-center justify-between px-4 border-b border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-ink-900 dark:text-white">JobHub Portal</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {currentNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary-600 text-white font-semibold'
                          : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800'
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="p-4 border-t border-ink-100 dark:border-ink-800 space-y-2">
              <Link
                to="/jobs"
                onClick={() => setMobileDrawerOpen(false)}
                className="block text-center py-2 text-xs font-medium text-ink-600 dark:text-ink-300 hover:underline"
              >
                Public Job Board
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-danger-600 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-950/40"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
