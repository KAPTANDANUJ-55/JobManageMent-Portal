import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_LABELS } from '@/utils/constants';
import { Users, Search, Shield, Ban, CheckCircle, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getUsers({ role: roleFilter, search });
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (user) => {
    try {
      const updated = await adminApi.toggleUserStatus(user.id);
      toast.success(
        'User Status Changed',
        `${user.name} is now ${updated.active ? 'Active' : 'Suspended'}`
      );
      loadUsers();
    } catch (err) {
      toast.error('Action Failed', err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Permanently delete account for "${user.name}"?`)) {
      return;
    }

    try {
      await adminApi.deleteUser(user.id);
      toast.success('User Deleted', `${user.name} has been removed.`);
      loadUsers();
    } catch (err) {
      toast.error('Delete Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
          User Account Directory
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Inspect registered Job Seekers, Recruiters, and Administrators across JobHub.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs font-semibold text-ink-800 dark:text-ink-200 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value={ROLES.SEEKER}>Job Seekers</option>
            <option value={ROLES.RECRUITER}>Recruiters</option>
            <option value={ROLES.ADMIN}>Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-ink-500 py-12 text-center">No users match your criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Affiliation / Headline</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {users.map((u) => {
                  const isAdmin = u.role === ROLES.ADMIN;
                  const isActive = u.active !== false;
                  return (
                    <tr key={u.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="font-bold text-ink-900 dark:text-white">{u.name}</p>
                            <p className="text-[11px] text-ink-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <Badge
                          tone={
                            isAdmin
                              ? 'warning'
                              : u.role === ROLES.RECRUITER
                              ? 'success'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {ROLE_LABELS[u.role] || u.role}
                        </Badge>
                      </td>

                      <td className="py-3.5 text-ink-600 dark:text-ink-300">
                        {u.companyName || u.headline || 'General Member'}
                      </td>

                      <td className="py-3.5">
                        <Badge tone={isActive ? 'success' : 'danger'} size="sm">
                          {isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>

                      <td className="py-3.5 text-right">
                        {!isAdmin && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-lg transition-colors text-xs font-semibold ${
                                isActive
                                  ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                  : 'text-success-600 hover:bg-success-50 dark:hover:bg-success-950/40'
                              }`}
                              title={isActive ? 'Suspend account' : 'Reactivate account'}
                            >
                              {isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
