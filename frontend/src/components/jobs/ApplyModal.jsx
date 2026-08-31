import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { applicationsApi } from '@/api';
import { FileText, Send, CheckCircle2, AlertCircle, Building2, UploadCloud } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { required, email, validate } from '@/utils/validators';

export default function ApplyModal({
  isOpen,
  onClose,
  job,
  onSuccess,
}) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    experienceYears: '3',
    resumeUrl: '',
    coverNote: '',
    customAnswers: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        candidateName: user.name || '',
        candidateEmail: user.email || '',
        candidatePhone: user.phone || '+91 98765 43210',
        resumeUrl: user.resumeUrl || 'https://drive.google.com/file/d/demo-resume/view',
      }));
    }
  }, [user, isOpen]);

  const validationSchema = {
    candidateName: [required('Full name')],
    candidateEmail: [required('Email address'), email()],
    candidatePhone: [required('Phone number')],
    resumeUrl: [required('Resume link / file')],
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

    if (!isAuthenticated) {
      toast.info('Please Sign In', 'You must be signed in as a job seeker to submit an application.');
      return;
    }

    try {
      setIsSubmitting(true);
      const app = await applicationsApi.apply(user, {
        jobId: job.id,
        ...formData,
      });

      setSubmitted(true);
      toast.success(
        'Application Submitted!',
        `Your application for ${job.title} at ${job.companyName} was received.`
      );

      if (onSuccess) {
        onSuccess(app);
      }
    } catch (err) {
      toast.error('Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? '' : `Apply for ${job.title}`}
      description={submitted ? '' : `${job.companyName} • ${job.location} • ${job.workMode || job.type}`}
      size="lg"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/50 text-success-600 dark:text-success-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-ink-900 dark:text-white">
              Application Sent Successfully!
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-300 max-w-md mx-auto">
              The recruitment team at <span className="font-semibold">{job.companyName}</span> has received your application. You can monitor its status from your dashboard.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.candidateName}
              onChange={(e) => handleChange('candidateName', e.target.value)}
              error={errors.candidateName}
              placeholder="e.g. Arsh Sharma"
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.candidateEmail}
              onChange={(e) => handleChange('candidateEmail', e.target.value)}
              error={errors.candidateEmail}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
              value={formData.candidatePhone}
              onChange={(e) => handleChange('candidatePhone', e.target.value)}
              error={errors.candidatePhone}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Years of Experience"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => handleChange('experienceYears', e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          <Input
            label="Resume Link or Portfolio File"
            required
            leftIcon={<UploadCloud className="w-4 h-4" />}
            value={formData.resumeUrl}
            onChange={(e) => handleChange('resumeUrl', e.target.value)}
            error={errors.resumeUrl}
            helperText="Provide a Google Drive, Dropbox, or portfolio PDF link"
            placeholder="https://drive.google.com/file/d/your-resume"
          />

          <Textarea
            label="Cover Note / Why are you a great fit?"
            rows={3}
            value={formData.coverNote}
            onChange={(e) => handleChange('coverNote', e.target.value)}
            placeholder="Briefly highlight your relevant experience, top achievements, and notice period..."
          />

          <div className="pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
