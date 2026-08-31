import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companiesApi } from '@/api';
import { Building2, Search, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setIsLoading(true);
        const res = await companiesApi.getCompanies({ search });
        setCompanies(res.companies || res || []);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanies();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Employer Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 dark:text-white tracking-tight">
          Explore Great Places to Work
        </h1>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Learn about company culture, team sizes, benefits, and view active job openings.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-ink-900 dark:text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-card"
          />
        </div>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 space-y-4"
            >
              <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-ink-900 rounded-3xl border border-ink-200 dark:border-ink-800 space-y-3">
          <Building2 className="w-12 h-12 text-ink-300 dark:text-ink-600 mx-auto" />
          <h3 className="text-base font-bold text-ink-900 dark:text-white">No companies found</h3>
          <p className="text-xs text-ink-500">Try searching for a different company name or industry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.id}`}
              className="group p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 hover:border-primary-300 dark:hover:border-primary-700 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar name={comp.name} size="lg" className="rounded-2xl shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-ink-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {comp.name}
                      </h3>
                      <p className="text-xs text-ink-500 font-medium">{comp.industry}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {comp.rating || '4.5'}
                  </span>
                </div>

                <p className="text-xs text-ink-600 dark:text-ink-300 line-clamp-3 leading-relaxed">
                  {comp.about}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-xs text-ink-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-ink-400" />
                  {comp.location || 'India'}
                </span>
                <span className="font-semibold text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  View open jobs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
