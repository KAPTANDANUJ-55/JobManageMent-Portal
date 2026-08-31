import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_HOME } from '@/utils/constants';
import { Briefcase, Eye, EyeOff, Lock, Mail, Sparkles, User, Shield, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { required, email, validate } from '@/utils/validators';

export default function LoginPage() {
  const { login, quickLoginAs } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(null);

  const destination = location.state?.from?.pathname;

  const validationSchema = {
    email: [required('Email address'), email()],
    password: [required('Password')],
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData, validationSchema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const user = await login({ email: formData.email, password: formData.password });
      toast.success('Welcome back!', `Signed in as ${user.name}`);
      navigate(destination || ROLE_HOME[user.role] || '/');
    } catch (err) {
      toast.error('Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    try {
      setQuickLoading(role);
      const user = await quickLoginAs(role);
      toast.success('Welcome back!', `Signed in as Demo ${user.name} (${user.role})`);
      navigate(destination || ROLE_HOME[user.role] || '/');
    } catch (err) {
      toast.error('Quick Login Failed', err.message);
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-ink-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
              JobHub
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-white tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
            Access your job applications, candidate pipelines, and profile.
          </p>
        </div>

        {/* Demo Fast Switcher Box */}
        <div className="p-4 rounded-2xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-900 dark:text-primary-200 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            1-Click Demo Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="white"
              size="sm"
              isLoading={quickLoading === ROLES.SEEKER}
              onClick={() => handleQuickLogin(ROLES.SEEKER)}
              className="text-xs py-2 bg-white dark:bg-ink-900 border-primary-200/80 dark:border-primary-900"
            >
              Job Seeker
            </Button>
            <Button
              variant="white"
              size="sm"
              isLoading={quickLoading === ROLES.RECRUITER}
              onClick={() => handleQuickLogin(ROLES.RECRUITER)}
              className="text-xs py-2 bg-white dark:bg-ink-900 border-primary-200/80 dark:border-primary-900"
            >
              Recruiter
            </Button>
            <Button
              variant="white"
              size="sm"
              isLoading={quickLoading === ROLES.ADMIN}
              onClick={() => handleQuickLogin(ROLES.ADMIN)}
              className="text-xs py-2 bg-white dark:bg-ink-900 border-primary-200/80 dark:border-primary-900"
            >
              Admin
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/90 dark:border-ink-800 p-6 sm:p-8 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="arsh@demo.com"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-ink-600 dark:text-ink-300 select-none">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
                />
                <span>Remember me</span>
              </label>
              <span className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-ink-100 dark:border-ink-800 text-center text-xs text-ink-600 dark:text-ink-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
