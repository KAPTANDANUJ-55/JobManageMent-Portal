import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_LABELS } from '@/utils/constants';
import { Sparkles, User, Briefcase, Shield, LogOut, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoRoleSwitcher() {
  const { user, role, quickLoginAs, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);

  const handleSwitch = async (targetRole) => {
    try {
      setLoadingRole(targetRole);
      const u = await quickLoginAs(targetRole);
      toast.success(
        'Role Switched',
        `Logged in as ${ROLE_LABELS[targetRole]} (${u.name})`
      );
      if (targetRole === ROLES.SEEKER) navigate('/seeker');
      else if (targetRole === ROLES.RECRUITER) navigate('/recruiter');
      else if (targetRole === ROLES.ADMIN) navigate('/admin');
      setIsOpen(false);
    } catch (e) {
      toast.error('Switch Failed', e.message);
    } finally {
      setLoadingRole(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Signed Out', 'You are now viewing as Guest');
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 font-sans">
      {isOpen ? (
        <div className="w-72 bg-white dark:bg-ink-900 rounded-2xl shadow-dropdown border border-ink-200 dark:border-ink-800 p-3.5 animate-scale-in mb-2">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              Demo Persona Switcher
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 p-1 rounded-md"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {/* Job Seeker Option */}
            <button
              type="button"
              disabled={loadingRole === ROLES.SEEKER}
              onClick={() => handleSwitch(ROLES.SEEKER)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs font-medium ${
                role === ROLES.SEEKER
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Job Seeker</div>
                  <div className="text-[10px] text-ink-400 font-normal">Arsh Sharma</div>
                </div>
              </div>
              {role === ROLES.SEEKER && <Check className="w-4 h-4 text-primary-600" />}
            </button>

            {/* Recruiter Option */}
            <button
              type="button"
              disabled={loadingRole === ROLES.RECRUITER}
              onClick={() => handleSwitch(ROLES.RECRUITER)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs font-medium ${
                role === ROLES.RECRUITER
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center text-success-600 dark:text-success-300 shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Recruiter</div>
                  <div className="text-[10px] text-ink-400 font-normal">Zenlytics / TechCorp</div>
                </div>
              </div>
              {role === ROLES.RECRUITER && <Check className="w-4 h-4 text-primary-600" />}
            </button>

            {/* Admin Option */}
            <button
              type="button"
              disabled={loadingRole === ROLES.ADMIN}
              onClick={() => handleSwitch(ROLES.ADMIN)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs font-medium ${
                role === ROLES.ADMIN
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center text-warning-600 dark:text-warning-300 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Administrator</div>
                  <div className="text-[10px] text-ink-400 font-normal">System Admin</div>
                </div>
              </div>
              {role === ROLES.ADMIN && <Check className="w-4 h-4 text-primary-600" />}
            </button>
          </div>

          {isAuthenticated && (
            <div className="mt-2 pt-2 border-t border-ink-100 dark:border-ink-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out to Guest mode
              </button>
            </div>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-xs font-semibold shadow-dropdown hover:opacity-95 transition-all hover:scale-105"
        aria-label="Demo role quick switcher"
      >
        <Sparkles className="w-3.5 h-3.5 text-warning-400 dark:text-warning-600 animate-spin" style={{ animationDuration: '4s' }} />
        <span>
          {isAuthenticated
            ? `Demo: ${ROLE_LABELS[role] || 'User'}`
            : 'Quick Demo Switcher'}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-70" /> : <ChevronUp className="w-3.5 h-3.5 opacity-70" />}
      </button>
    </div>
  );
}
