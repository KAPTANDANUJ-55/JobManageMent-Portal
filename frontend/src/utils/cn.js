import clsx from 'clsx';

/**
 * Tiny className joiner. Filters out falsy values so conditional classes read
 * cleanly: cn('base', isActive && 'active', className)
 */
export function cn(...inputs) {
  return clsx(inputs);
}

export default cn;
