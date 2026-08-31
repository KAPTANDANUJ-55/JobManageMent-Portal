import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { companiesApi } from '@/api';
import { Building2, Globe, MapPin, Users, Save, Star } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function RecruiterCompanyPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [company, setCompany] = useState({
    name: 'Zenlytics',
    industry: 'Analytics SaaS',
    location: 'Bengaluru, India',
    size: '250-500 employees',
    website: 'https://zenlytics.in',
    about:
      'Zenlytics builds a self-serve product analytics platform used by more than 900 Indian SaaS and D2C teams. The engineering group is split into small product pods that own a surface end to end, from the query planner to the dashboards customers stare at every morning.',
    rating: 4.4,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      if (user?.companyId) {
        try {
          const comp = await companiesApi.getCompanyById(user.companyId);
          if (comp) setCompany(comp);
        } catch (e) {
          console.warn(e);
        }
      }
    }
    loadCompany();
  }, [user]);

  const handleChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (user?.companyId) {
        await companiesApi.updateCompany(user.companyId, company);
      }
      toast.success('Company Profile Updated', 'Your company branding and information were saved.');
    } catch (err) {
      toast.error('Save Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
          Employer Company Profile
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Customize your company's public landing page, culture description, and branding.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Company Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar name={company.name} size="xl" className="rounded-3xl shrink-0 ring-4 ring-primary-100 dark:ring-primary-950" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink-900 dark:text-white">
                  {company.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {company.rating || '4.5'}
                </span>
              </div>
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                {company.industry}
              </p>
              <p className="text-xs text-ink-400">{company.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ink-100 dark:border-ink-800">
            <Input
              label="Company Name"
              required
              value={company.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Zenlytics India"
            />

            <Input
              label="Industry / Domain"
              required
              value={company.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              placeholder="e.g. Analytics SaaS"
            />

            <Input
              label="Headquarters Location"
              value={company.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka"
            />

            <Input
              label="Team Size"
              value={company.size}
              onChange={(e) => handleChange('size', e.target.value)}
              placeholder="e.g. 250-500 employees"
            />
          </div>

          <Input
            label="Company Website URL"
            leftIcon={<Globe className="w-4 h-4" />}
            value={company.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://zenlytics.in"
          />

          <Textarea
            label="About the Company & Culture"
            rows={5}
            value={company.about}
            onChange={(e) => handleChange('about', e.target.value)}
            placeholder="Share your company mission, tech culture, and what it's like to work here..."
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="px-8"
          >
            Save Company Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
