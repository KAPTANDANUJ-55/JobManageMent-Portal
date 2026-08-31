import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, ROLE_HOME } from '@/utils/constants';
import { Briefcase, Eye, EyeOff, Lock, Mail, User, Building2, ArrowRight, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { required, email, minLength, matches, validate, passwordStrength } from '@/utils/validators';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'RECRUITER' ? ROLES.RECRUITER : ROLES.SEEKER;

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    headline: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('role') === 'RECRUITER') {
      setRole(ROLES.RECRUITER);
    }
  }, [searchParams]);

  const strength = passwordStrength(formData.password);

  const validationSchema = {
    name: [required('Full name')],
    email: [required('Email address'), email()],
    password: [required('Password'), minLength(6, 'Password')],
    confirmPassword: [required('Confirm password'), matches('password', 'Passwords')],
    ...(role === ROLES.RECRUITER ? { companyName: [required('Company name')] } : {}),
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error('Terms Required', 'Please accept the Terms of Service to continue.');
      return;
    }

    const validationErrors = validate(formData, validationSchema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        companyName: role === ROLES.RECRUITER ? formData.companyName : undefined,
        headline: formData.headline || (role === ROLES.SEEKER ? 'Software Engineer' : undefined),
      });

      toast.success('Account Created!', `Welcome to JobHub, ${user.name}`);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      toast.error('Registration Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['bg-ink-200', 'bg-danger-500', 'bg-warning-500', 'bg-info-500', 'bg-success-500'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
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
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
            Join thousands of candidates and companies discovering great opportunities.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-ink-100 dark:bg-ink-800/80 border border-ink-200 dark:border-ink-700">
          <button
            type="button"
            onClick={() => setRole(ROLES.SEEKER)}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === ROLES.SEEKER
                ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-sm'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            I'm a Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole(ROLES.RECRUITER)}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === ROLES.RECRUITER
                ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-sm'
                : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            I'm an Employer / Recruiter
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/90 dark:border-ink-800 p-6 sm:p-8 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              leftIcon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder={role === ROLES.RECRUITER ? 'e.g. Priya Sharma' : 'e.g. Arsh Sharma'}
            />

            {role === ROLES.RECRUITER && (
              <Input
                label="Company Name"
                required
                leftIcon={<Building2 className="w-4 h-4" />}
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                error={errors.companyName}
                placeholder="e.g. Zenlytics India"
              />
            )}

            <Input
              label="Email Address"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
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
              placeholder="At least 6 characters"
            />

            {/* Password strength meter */}
            {formData.password && (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-500">Strength:</span>
                  <span className="font-semibold text-ink-700 dark:text-ink-300">
                    {strength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full transition-colors ${
                        step <= strength.score ? strengthColors[strength.score] : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Repeat your password"
            />

            <div className="flex items-start gap-2.5 text-xs pt-1">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                className="rounded mt-0.5 text-primary-600 focus:ring-primary-500 border-ink-300 dark:border-ink-700"
              />
              <label htmlFor="agreeTerms" className="text-ink-600 dark:text-ink-300 leading-snug">
                I agree to the{' '}
                <span className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer">
                  Privacy Policy
                </span>.
              </label>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create {role === ROLES.RECRUITER ? 'Employer Account' : 'Job Seeker Account'}
            </Button>
          </form>

          <div className="pt-4 border-t border-ink-100 dark:border-ink-800 text-center text-xs text-ink-600 dark:text-ink-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
