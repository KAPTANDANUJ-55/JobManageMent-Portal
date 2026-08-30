// ---------------------------------------------------------------------------
// Shared domain constants. These mirror the enums the backend is expected to
// expose (see API_CONTRACT.md) so both sides speak the same vocabulary.
// ---------------------------------------------------------------------------

export const ROLES = {
  SEEKER: 'JOB_SEEKER',
  RECRUITER: 'RECRUITER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.SEEKER]: 'Job Seeker',
  [ROLES.RECRUITER]: 'Recruiter',
  [ROLES.ADMIN]: 'Administrator',
};

/** Landing route for each role right after login. */
export const ROLE_HOME = {
  [ROLES.SEEKER]: '/seeker',
  [ROLES.RECRUITER]: '/recruiter',
  [ROLES.ADMIN]: '/admin',
};

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead'];

export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];

export const JOB_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
};

export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  IN_REVIEW: 'IN_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW: 'INTERVIEW',
  OFFERED: 'OFFERED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

/** Ordered pipeline used by the recruiter's applicant board. */
export const APPLICATION_PIPELINE = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.IN_REVIEW,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.INTERVIEW,
  APPLICATION_STATUS.OFFERED,
];

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.IN_REVIEW]: 'In review',
  [APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
  [APPLICATION_STATUS.INTERVIEW]: 'Interview',
  [APPLICATION_STATUS.OFFERED]: 'Offer',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.WITHDRAWN]: 'Withdrawn',
};

/** Maps a status to a Badge tone so colour usage stays consistent. */
export const APPLICATION_STATUS_TONE = {
  [APPLICATION_STATUS.APPLIED]: 'neutral',
  [APPLICATION_STATUS.IN_REVIEW]: 'info',
  [APPLICATION_STATUS.SHORTLISTED]: 'primary',
  [APPLICATION_STATUS.INTERVIEW]: 'warning',
  [APPLICATION_STATUS.OFFERED]: 'success',
  [APPLICATION_STATUS.REJECTED]: 'danger',
  [APPLICATION_STATUS.WITHDRAWN]: 'neutral',
};

export const CATEGORIES = [
  'Engineering',
  'Design',
  'Data & Analytics',
  'Product',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Customer Support',
  'Operations',
];

export const PAGE_SIZE = 8;
export const TOKEN_KEY = 'jobhub.token';
export const USER_KEY = 'jobhub.user';
