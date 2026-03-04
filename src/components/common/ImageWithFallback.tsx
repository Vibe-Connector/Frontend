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
  placeholderClassName = 'flex aspect-square items-center justify-center bg-disabled text-caption text-xs',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <div className={placeholderClassName}>No Image</div>;
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
