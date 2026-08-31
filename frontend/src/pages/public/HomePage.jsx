import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsApi, companiesApi } from '@/api';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  Palette,
  LineChart,
  Layers,
  Megaphone,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import JobCard from '@/components/jobs/JobCard';
import ApplyModal from '@/components/jobs/ApplyModal';
import Skeleton from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/utils/constants';

const categoryIcons = {
  Engineering: <Code2 className="w-5 h-5 text-primary-500" />,
  Design: <Palette className="w-5 h-5 text-pink-500" />,
  'Data & Analytics': <LineChart className="w-5 h-5 text-emerald-500" />,
  Product: <Layers className="w-5 h-5 text-amber-500" />,
  Marketing: <Megaphone className="w-5 h-5 text-purple-500" />,
  Sales: <TrendingUp className="w-5 h-5 text-blue-500" />,
  'Human Resources': <Users className="w-5 h-5 text-rose-500" />,
  'Customer Support': <Headphones className="w-5 h-5 text-cyan-500" />,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setIsLoading(true);
        const [jobsRes, compsRes] = await Promise.all([
          jobsApi.getJobs({ limit: 6 }),
          companiesApi.getCompanies({ limit: 6 }),
        ]);
        setFeaturedJobs(jobsRes.jobs || jobsRes.slice?.(0, 6) || []);
        setTopCompanies(compsRes.companies || compsRes.slice?.(0, 6) || []);
      } catch (err) {
        console.warn('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleApplyClick = (job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-primary-50/70 via-ink-50 to-white dark:from-ink-900/60 dark:via-ink-950 dark:to-ink-950">
        {/* Glow backdrop elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-400/15 dark:bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-ink-800 border border-primary-200 dark:border-primary-800/80 shadow-sm text-xs font-semibold text-primary-700 dark:text-primary-300 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
              <span>Next-Gen Tech & Engineering Job Portal</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 dark:text-white tracking-tight leading-[1.15]">
              Find the role where you can do your{' '}
              <span className="text-primary-600 dark:text-primary-400 underline decoration-primary-500/40 underline-offset-8">
                best work
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-700 dark:text-ink-200 max-w-2xl mx-auto leading-relaxed font-normal">
              Explore thousands of verified engineering, product, and tech roles at India's highest-growth startups and top product companies.
            </p>

            {/* Live Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700/80 shadow-dropdown flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 max-w-2xl mx-auto text-left"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2">
                <Search className="w-5 h-5 text-ink-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skills, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-ink-200 dark:bg-ink-700" />

              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2">
                <MapPin className="w-5 h-5 text-ink-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Bengaluru, Remote)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="rounded-xl sm:rounded-full px-7"
              >
                Search Jobs
              </Button>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-ink-500 dark:text-ink-400">
              <span className="font-semibold">Trending:</span>
              {['Frontend React', 'Full Stack', 'Remote', 'Bengaluru', 'Python & AI', 'Lead Architect'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    navigate(`/jobs?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-ink-800 border border-ink-200/80 dark:border-ink-700 hover:border-primary-400 dark:hover:border-primary-600 text-ink-700 dark:text-ink-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Explore Careers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight mt-1">
              Browse by Department
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat}
              to={`/jobs?category=${encodeURIComponent(cat)}`}
              className="group p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800 hover:border-primary-300 dark:hover:border-primary-700 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                {categoryIcons[cat] || <Briefcase className="w-5 h-5 text-primary-500" />}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {cat}
                </h3>
                <p className="text-xs text-ink-400 mt-0.5">Explore active openings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Featured Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight mt-1">
              Top Jobs This Week
            </h2>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Browse All Openings
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Companies Hiring */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Employers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight mt-1">
              Top Tech Companies Hiring
            </h2>
          </div>
          <Link to="/companies">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore All Companies
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topCompanies.map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.id}`}
              className="group p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/80 dark:border-ink-800 hover:border-primary-300 dark:hover:border-primary-700 shadow-card hover:shadow-card-hover transition-all flex items-start gap-4"
            >
              <Avatar name={comp.name} size="lg" className="rounded-xl shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                    {comp.name}
                  </h3>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
                    ★ {comp.rating || '4.5'}
                  </span>
                </div>
                <p className="text-xs text-ink-500 truncate">{comp.industry}</p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-ink-400">
                  <span>{comp.location || 'India'}</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    View open roles →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* For Candidates & Employers Dual Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seeker Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary-900 to-indigo-950 text-white space-y-5 relative overflow-hidden shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-200">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Are you looking for your next role?</h3>
              <p className="text-sm text-primary-100/90 leading-relaxed">
                Build your verified profile, set salary expectations, apply with 1-click, and track applications transparently.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/register">
                <Button variant="white" size="md">
                  Create Candidate Profile
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
                  Search Openings
                </Button>
              </Link>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-ink-900 to-ink-950 text-white border border-ink-800 space-y-5 relative overflow-hidden shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-success-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Are you hiring top tech talent?</h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                Post high-visibility job openings, manage candidates with a Kanban ATS pipeline, and close roles faster.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/register?role=RECRUITER">
                <Button variant="primary" size="md">
                  Post a Job Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="md" className="border-ink-700 text-white hover:bg-white/10">
                  Employer Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={selectedJobForApply}
        />
      )}
    </div>
  );
}
