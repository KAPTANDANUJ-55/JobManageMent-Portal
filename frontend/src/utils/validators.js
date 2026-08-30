// ---------------------------------------------------------------------------
// Form validation. Each validator returns an error string or '' when valid,
// so forms can do: setErrors(validate(values, schema))
// ---------------------------------------------------------------------------

export const required = (label = 'This field') => (value) =>
  value === undefined || value === null || String(value).trim() === '' ? `${label} is required` : '';

export const email = () => (value) => {
  if (!value) return '';
  // Deliberately simple: catches typos without rejecting valid odd addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
    ? ''
    : 'Enter a valid email address';
};

export const minLength = (n, label = 'This field') => (value) =>
  value && String(value).length < n ? `${label} must be at least ${n} characters` : '';

export const maxLength = (n, label = 'This field') => (value) =>
  value && String(value).length > n ? `${label} must be under ${n} characters` : '';

export const matches = (otherKey, label = 'Passwords') => (value, values) =>
  value !== values?.[otherKey] ? `${label} do not match` : '';

export const isNumber = (label = 'This field') => (value) =>
  value !== '' && value != null && Number.isNaN(Number(value)) ? `${label} must be a number` : '';

export const min = (n, label = 'This field') => (value) =>
  value !== '' && value != null && Number(value) < n ? `${label} must be at least ${n}` : '';

export const url = () => (value) => {
  if (!value) return '';
  try {
    new URL(String(value).startsWith('http') ? value : `https://${value}`);
    return '';
  } catch {
    return 'Enter a valid URL';
  }
};

/**
 * Runs a schema of validators against a values object.
 * schema: { fieldName: [validatorFn, ...] }
 * returns: { fieldName: 'first error message' } — only for failing fields.
 */
export function validate(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, validators]) => {
    for (const fn of validators) {
      const message = fn(values[field], values);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  });
  return errors;
}

/** Rough 0-4 password strength score plus a label, for the register form. */
export function passwordStrength(value = '') {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}
