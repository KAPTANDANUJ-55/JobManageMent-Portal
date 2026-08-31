import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Code,
  Link2,
  Plus,
  X,
  Save,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const popularSkills = [
  'React',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Tailwind CSS',
  'GraphQL',
  'Next.js',
];

export default function SeekerProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    headline: '',
    location: '',
    bio: '',
    resumeUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        headline: user.headline || 'Full Stack React & Node Developer',
        location: user.location || 'Bengaluru, India',
        bio:
          user.bio ||
          'Passionate frontend & full-stack software engineer with experience building scalable, responsive web applications in React and modern JavaScript.',
        resumeUrl: user.resumeUrl || 'https://drive.google.com/file/d/demo-resume/view',
        portfolioUrl: user.portfolioUrl || 'https://github.com',
        githubUrl: user.githubUrl || 'https://github.com',
        linkedinUrl: user.linkedinUrl || 'https://linkedin.com',
        skills: user.skills || ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'REST APIs'],
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfile(formData);
      toast.success('Profile Saved', 'Your candidate profile has been updated.');
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
          Candidate Profile & Resume
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-1">
          Manage your personal details, resume file, skills, and portfolio links.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar name={formData.name || 'User'} size="xl" className="rounded-3xl shrink-0 ring-4 ring-primary-100 dark:ring-primary-950" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-ink-900 dark:text-white">
                {formData.name || 'Your Name'}
              </h2>
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                {formData.headline}
              </p>
              <p className="text-xs text-ink-400">{formData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ink-100 dark:border-ink-800">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Arsh Sharma"
            />
            <Input
              label="Professional Headline / Title"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
            <Input
              label="Email Address"
              disabled
              value={formData.email}
              helperText="Email is managed via account settings"
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Current Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bengaluru, India"
            />
          </div>

          <Textarea
            label="Professional Summary / Bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Introduce your background, key strengths, and what kind of roles you are seeking..."
          />
        </div>

        {/* Skills Management Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Skills & Technologies
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Add skills to receive better job recommendations and higher recruiter match rates.
            </p>
          </div>

          {/* Current Skills Tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-200/70 dark:border-ink-800">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-ink-800 text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-sm animate-scale-in"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-danger-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a new skill (e.g. Next.js, Docker, Java)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button
              variant="secondary"
              type="button"
              onClick={() => handleAddSkill()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* Suggested skills pills */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block">
              Suggested Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSkills
                .filter((s) => !formData.skills.includes(s))
                .slice(0, 8)
                .map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => handleAddSkill(suggested)}
                    className="px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-primary-50 text-[11px] font-medium text-ink-600 dark:text-ink-300 hover:text-primary-600 transition-colors"
                  >
                    + {suggested}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Resume & Portfolio Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              Resume & Online Profiles
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Share links to your resume file, portfolio, GitHub, and LinkedIn profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Resume URL (Google Drive / Dropbox)"
              leftIcon={<UploadCloud className="w-4 h-4" />}
              value={formData.resumeUrl}
              onChange={(e) => handleChange('resumeUrl', e.target.value)}
              placeholder="https://drive.google.com/..."
            />
            <Input
              label="Personal Portfolio Website"
              leftIcon={<Globe className="w-4 h-4" />}
              value={formData.portfolioUrl}
              onChange={(e) => handleChange('portfolioUrl', e.target.value)}
              placeholder="https://yourportfolio.dev"
            />
            <Input
              label="GitHub Profile URL"
              leftIcon={<Code className="w-4 h-4" />}
              value={formData.githubUrl}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              placeholder="https://github.com/username"
            />
            <Input
              label="LinkedIn Profile URL"
              leftIcon={<Link2 className="w-4 h-4" />}
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
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
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
