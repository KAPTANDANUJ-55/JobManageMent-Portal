import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api';
import { TOKEN_KEY, USER_KEY, ROLES, ROLE_HOME } from '@/utils/constants';
import { DEMO_PASSWORD } from '@/api/mock/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify with getMe
          try {
            const freshUser = await authApi.getMe();
            if (freshUser) {
              setUser(freshUser);
              localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            }
          } catch (e) {
            console.warn('Silent token check failed:', e);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return null;
      const updated = await authApi.updateProfile(user.id, updates);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const quickLoginAs = useCallback(
    async (role) => {
      let email = 'arsh@demo.com';
      if (role === ROLES.RECRUITER) email = 'recruiter@demo.com';
      if (role === ROLES.ADMIN) email = 'admin@demo.com';

      return login({ email, password: DEMO_PASSWORD });
    },
    [login]
  );

  const refreshUser = useCallback(async () => {
    if (!user) return null;
    const fresh = await authApi.getMe();
    if (fresh) {
      setUser(fresh);
      localStorage.setItem(USER_KEY, JSON.stringify(fresh));
    }
    return fresh;
  }, [user]);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    quickLoginAs,
    refreshUser,
    getHomeRoute: () => (user?.role ? ROLE_HOME[user.role] : '/'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
