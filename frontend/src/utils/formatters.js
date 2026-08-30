// ---------------------------------------------------------------------------
// Display helpers. Kept pure so they are trivial to reason about and reuse.
// ---------------------------------------------------------------------------

/** 1200000 -> "12L" style short INR figure, e.g. "₹12L". */
export function formatSalary(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  const n = Number(amount);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

/** "₹8L – ₹14L / year" */
export function formatSalaryRange(min, max, period = 'year') {
  if (min == null && max == null) return 'Not disclosed';
  if (min != null && max != null) {
    return `${formatSalary(min)} – ${formatSalary(max)} / ${period}`;
  }
  return `${formatSalary(min ?? max)} / ${period}`;
}

export function formatNumber(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
}

/** "12 Mar 2026" */
export function formatDate(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "3 days ago", "just now", "in 2 weeks" */
export function timeAgo(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  const past = seconds >= 0;
  const abs = Math.abs(seconds);
  if (abs < 45) return 'just now';
  const units = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2592000],
    ['year', 31536000],
  ];
  let label = 'year';
  let size = 31536000;
  for (let i = 0; i < units.length; i += 1) {
    const [name, secs] = units[i];
    const next = units[i + 1];
    if (!next || abs < next[1]) {
      label = name;
      size = secs;
      break;
    }
  }
  const value = Math.max(1, Math.round(abs / size));
  const plural = value === 1 ? label : `${label}s`;
  return past ? `${value} ${plural} ago` : `in ${value} ${plural}`;
}

/** "Arsh Sharma" -> "AS" (used by the Avatar fallback). */
export function initials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function truncate(text, max = 140) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function pluralize(count, singular, plural) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

/** Deterministic pastel background for company/user avatars without images. */
export function colorFromString(value = '') {
  const palette = [
    'bg-primary-100 text-primary-700',
    'bg-success-100 text-success-700',
    'bg-warning-100 text-warning-700',
    'bg-info-100 text-info-700',
    'bg-danger-100 text-danger-700',
    'bg-ink-200 text-ink-700',
  ];
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return palette[hash % palette.length];
}
