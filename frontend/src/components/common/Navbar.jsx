import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_LABELS } from '@/utils/constants';
import {
  Briefcase,
  Search,
  Building2,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  PlusCircle,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, role, isAuthenticated, logout, getHomeRoute } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = () => {
    logout();
    toast.info('Signed out', 'You have been successfully logged out.');
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-xl ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 font-semibold'
        : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-200/80 dark:border-ink-800/80 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-ink-900 via-primary-700 to-primary-600 dark:from-white dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                  JobHub
                </span>
                <span className="text-[9px] uppercase tracking-widest text-ink-400 font-bold -mt-1">
                  Portal
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/jobs" className={navLinkClass}>
                Find Jobs
              </NavLink>
              <NavLink to="/companies" className={navLinkClass}>
                Companies
              </NavLink>
              {!isAuthenticated && (
                <NavLink to="/register?role=RECRUITER" className={navLinkClass}>
                  For Employers
                </NavLink>
              )}
              {isAuthenticated && (
                <NavLink to={getHomeRoute()} className={navLinkClass}>
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Button */}
            <Link
              to="/jobs"
              className="p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors hidden sm:flex"
              title="Search Jobs"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-warning-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Dropdown (if authenticated) */}
            {isAuthenticated && <NotificationDropdown />}

            {/* Auth Buttons or User Avatar */}
            {isAuthenticated && user ? (
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-700/80 transition-colors"
                  aria-expanded={userDropdownOpen}
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-ink-900 dark:text-white leading-none truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-tight">
                      {ROLE_LABELS[role]}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-dropdown z-50 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-ink-100 dark:border-ink-800">
                      <p className="text-xs font-bold text-ink-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-ink-500 dark:text-ink-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5">
                        <Badge
                          tone={
                            role === ROLES.ADMIN
                              ? 'warning'
                              : role === ROLES.RECRUITER
                              ? 'success'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {ROLE_LABELS[role]}
                        </Badge>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getHomeRoute()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-ink-400" />
                        Dashboard
                      </Link>

                      {role === ROLES.SEEKER && (
                        <>
                          <Link
                            to="/seeker/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <FileText className="w-4 h-4 text-ink-400" />
                            My Applications
                          </Link>
                          <Link
                            to="/seeker/saved"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <BookmarkCheck className="w-4 h-4 text-ink-400" />
                            Saved Jobs
                          </Link>
                          <Link
                            to="/seeker/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <User className="w-4 h-4 text-ink-400" />
                            Profile & Resume
                          </Link>
                        </>
                      )}

                      {role === ROLES.RECRUITER && (
                        <>
                          <Link
                            to="/recruiter/jobs/new"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <PlusCircle className="w-4 h-4 text-primary-500" />
                            Post a New Job
                          </Link>
                          <Link
                            to="/recruiter/jobs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <Briefcase className="w-4 h-4 text-ink-400" />
                            Manage Jobs
                          </Link>
                          <Link
                            to="/recruiter/applicants"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <FileText className="w-4 h-4 text-ink-400" />
                            Candidate ATS
                          </Link>
                          <Link
                            to="/recruiter/company"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <Building2 className="w-4 h-4 text-ink-400" />
                            Company Profile
                          </Link>
                        </>
                      )}

                      {role === ROLES.ADMIN && (
                        <>
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <User className="w-4 h-4 text-ink-400" />
                            User Management
                          </Link>
                          <Link
                            to="/admin/jobs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                          >
                            <Shield className="w-4 h-4 text-ink-400" />
                            Job Moderation
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 mt-1 border-t border-ink-100 dark:border-ink-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 md:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="space-y-1">
            <NavLink
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <Search className="w-4 h-4 text-primary-500" />
              Find Jobs
            </NavLink>
            <NavLink
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <Building2 className="w-4 h-4 text-primary-500" />
              Companies
            </NavLink>

            {isAuthenticated ? (
              <NavLink
                to={getHomeRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <LayoutDashboard className="w-4 h-4 text-primary-500" />
                Go to Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/register?role=RECRUITER"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <Briefcase className="w-4 h-4 text-primary-500" />
                For Employers (Post Jobs)
              </NavLink>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="pt-3 border-t border-ink-100 dark:border-ink-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-ink-100 dark:border-ink-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-danger-600 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-950/40"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.name})
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
