import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { jobsApi } from '@/api';
import {
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
  CATEGORIES,
} from '@/utils/constants';
import { required, validate } from '@/utils/validators';
import {
  Plus,
  X,
  ArrowLeft,
  Save,
  Eye,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { formatSalaryRange } from '@/utils/formatters';

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
  'Kubernetes',
  'Tailwind CSS',
  'GraphQL',
];

export default function PostJobPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    type: JOB_TYPES[0],
    workMode: WORK_MODES[0],
    experienceLevel: EXPERIENCE_LEVELS[2],
    location: 'Bengaluru, India',
    salaryMin: 1200000,
    salaryMax: 2400000,
    description: '',
    skills: ['React', 'JavaScript', 'Tailwind CSS'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadExistingJob = async () => {
      try {
        const job = await jobsApi.getJobById(id);
        if (job) {
          setFormData({
            title: job.title || '',
            category: job.category || CATEGORIES[0],
            type: job.type || JOB_TYPES[0],
            workMode: job.workMode || WORK_MODES[0],
            experienceLevel: job.experienceLevel || EXPERIENCE_LEVELS[2],
            location: job.location || 'Bengaluru, India',
            salaryMin: job.salaryMin || 1200000,
            salaryMax: job.salaryMax || 2400000,
            description: job.description || '',
            skills: job.skills || ['React', 'JavaScript'],
          });
        }
      } catch (err) {
        toast.error('Failed to load job', err.message);
      }
    };

    if (isEditing && id) {
      loadExistingJob();
    }
  }, [isEditing, id, toast]);

  const validationSchema = {
    title: [required('Job title')],
    location: [required('Location')],
    description: [required('Job description')],
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData, validationSchema);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await jobsApi.updateJob(id, formData);
        toast.success('Job Updated', `"${formData.title}" has been updated.`);
      } else {
        await jobsApi.createJob(user, formData);
        toast.success('Job Posted!', `"${formData.title}" is now live.`);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error('Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back link & Header */}
      <div>
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Jobs
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Job Opening' : 'Post a New Job Opening'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-500 mt-1">
              Reach thousands of qualified tech professionals and engineering candidates.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Live Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Role Overview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <h2 className="text-base font-bold text-ink-900 dark:text-white">
            1. Role & Basic Information
          </h2>

          <Input
            label="Job Title"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
            placeholder="e.g. Senior Frontend Engineer (React / TypeScript)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department / Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            <Select
              label="Employment Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
            />

            <Select
              label="Work Mode"
              value={formData.workMode}
              onChange={(e) => handleChange('workMode', e.target.value)}
              options={WORK_MODES.map((m) => ({ value: m, label: m }))}
            />

            <Select
              label="Experience Level"
              value={formData.experienceLevel}
              onChange={(e) => handleChange('experienceLevel', e.target.value)}
              options={EXPERIENCE_LEVELS.map((exp) => ({ value: exp, label: exp }))}
            />
          </div>

          <Input
            label="Location"
            required
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            error={errors.location}
            placeholder="e.g. Bengaluru, India (or Remote)"
          />
        </div>

        {/* Section 2: Compensation Range */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              2. Annual Salary Range (INR)
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Transparent pay ranges generate 2.5x more qualified candidate applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Salary (₹ / Year)"
              type="number"
              value={formData.salaryMin}
              onChange={(e) => handleChange('salaryMin', Number(e.target.value))}
              placeholder="1200000"
              helperText={`Formatted: ${formatSalaryRange(formData.salaryMin, null)}`}
            />

            <Input
              label="Maximum Salary (₹ / Year)"
              type="number"
              value={formData.salaryMax}
              onChange={(e) => handleChange('salaryMax', Number(e.target.value))}
              placeholder="2400000"
              helperText={`Formatted: ${formatSalaryRange(null, formData.salaryMax)}`}
            />
          </div>
        </div>

        {/* Section 3: Job Description */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              3. Detailed Description & Responsibilities
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Separate paragraphs with a blank line. Include key responsibilities, qualifications, and stack details.
            </p>
          </div>

          <Textarea
            rows={8}
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder="We are looking for a Senior Frontend Engineer to build high-performance user interfaces...&#10;&#10;Key Responsibilities:&#10;- Lead architecture of core web application modules&#10;- Partner with product and design pods&#10;&#10;Requirements:&#10;- 4+ years building production React applications&#10;- Strong command of JavaScript, TypeScript, and CSS"
          />
        </div>

        {/* Section 4: Required Skills */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-white">
              4. Required Tech Stack & Skills
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Candidates with these tags will see this job highlighted in their recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-ink-50 dark:bg-ink-950/60 border border-ink-200/70 dark:border-ink-800">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-ink-800 text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-sm"
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

          <div className="flex gap-2">
            <Input
              placeholder="Add skill tag (e.g. Next.js, Redux, Docker)..."
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

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
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

        {/* Submit Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/recruiter/jobs">
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="px-8"
          >
            {isEditing ? 'Save Changes' : 'Publish Job Opening'}
          </Button>
        </div>
      </form>

      {/* Live Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Job Posting Preview"
        description="This is how candidates will view your job opening"
        size="xl"
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              {user?.companyName || 'Your Company'}
            </span>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-white">
              {formData.title || 'Untitled Job Position'}
            </h2>
            <p className="text-xs text-ink-500">
              {formData.location} • {formData.workMode} • {formData.type} • {formData.experienceLevel}
            </p>
            <p className="text-sm font-bold text-ink-900 dark:text-white pt-1">
              {formatSalaryRange(formData.salaryMin, formData.salaryMax)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800 text-xs text-ink-700 dark:text-ink-300 leading-relaxed whitespace-pre-line">
            {formData.description || 'No description provided yet.'}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {formData.skills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
