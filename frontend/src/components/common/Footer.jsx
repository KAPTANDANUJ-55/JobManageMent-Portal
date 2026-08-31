import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ArrowUpRight, Globe, Code, Share2 } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200/80 dark:border-ink-800/80 bg-white dark:bg-ink-950 text-ink-600 dark:text-ink-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-primary-500/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-ink-900 via-primary-700 to-primary-600 dark:from-white dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                JobHub
              </span>
            </Link>
            <p className="text-sm text-ink-600 dark:text-ink-400 max-w-sm leading-relaxed">
              Empowering top tech talent and high-growth companies to discover each other. Find your dream role or hire exceptional candidates seamlessly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-ink-200 dark:border-ink-800 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors text-ink-600 dark:text-ink-300"
                aria-label="GitHub"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-ink-200 dark:border-ink-800 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors text-ink-600 dark:text-ink-300"
                aria-label="Twitter"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-ink-200 dark:border-ink-800 flex items-center justify-center hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors text-ink-600 dark:text-ink-300"
                aria-label="LinkedIn"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: For Job Seekers */}
          <div>
            <h4 className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?mode=Remote" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Featured Companies
                </Link>
              </li>
              <li>
                <Link to="/seeker/profile" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Resume & Profile
                </Link>
              </li>
              <li>
                <Link to="/seeker/applications" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h4 className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1">
                  Post a Job <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Manage Job Listings
                </Link>
              </li>
              <li>
                <Link to="/recruiter/applicants" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Candidate Pipeline ATS
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Company Branding
                </Link>
              </li>
              <li>
                <Link to="/register?role=RECRUITER" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Employer Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Categories */}
          <div>
            <h4 className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider mb-4">
              Popular Fields
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/jobs?category=${encodeURIComponent(cat)}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-ink-100 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JobHub Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-ink-500">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-danger-500 fill-danger-500" />
            <span>for seamless hiring</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
