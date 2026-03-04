import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  loading?: 'lazy' | 'eager';
}

export default function ImageWithFallback({
  src,
  alt,
  className = 'w-full object-cover',
  placeholderClassName = 'flex aspect-square items-center justify-center',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={placeholderClassName}
        style={{
          background: 'linear-gradient(135deg, #e0e0e0 0%, #c4c4c4 50%, #a8a8a8 100%)',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}
