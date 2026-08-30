import React from 'react';
import { cn } from '@/utils/cn';
import { initials, colorFromString } from '@/utils/formatters';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-12 h-12 text-base font-semibold',
  xl: 'w-16 h-16 text-lg font-bold',
  '2xl': 'w-20 h-20 text-xl font-bold',
};

export default function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  rounded = 'rounded-xl',
}) {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;
  const fallbackText = initials(name);
  const colorClass = colorFromString(name);

  if (showFallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center select-none shrink-0 uppercase',
          sizes[size] || sizes.md,
          rounded,
          colorClass,
          className
        )}
        title={name}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className={cn(
        'object-cover shrink-0',
        sizes[size] || sizes.md,
        rounded,
        className
      )}
    />
  );
}
