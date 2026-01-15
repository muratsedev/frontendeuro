"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { normalizeImagePath } from '../app/lib/imageUtils';

interface ArticleImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackElement?: React.ReactNode;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  priority?: boolean;
}

const ArticleImageEnhanced: React.FC<ArticleImageProps> = ({
  src,
  alt,
  className = "",
  fallbackElement,
  objectFit = 'contain', // Default to contain to show full image
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Check if we have a valid image source
  const hasValidSrc = src && src.trim() && !imageError;

  // Normalize image path using centralized utility
  const normalizedSrc = hasValidSrc ? normalizeImagePath(src.trim()) : '';

  // Default fallback
  const defaultFallback = (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-white text-center p-8">
        <div className="text-4xl mb-4">📰</div>
        <p className="text-lg">مقال مميز جيد</p>
      </div>
    </div>
  );

  if (!hasValidSrc) {
    console.log('ArticleImageEnhanced: Showing fallback due to invalid src');
    return fallbackElement || defaultFallback;
  }

  // Map objectFit to CSS classes
  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'scale-down': 'object-scale-down',
    'none': 'object-none'
  }[objectFit];

  return (
    <div className="relative w-full h-full">
      {/* Show fallback while loading or if error */}
      {(imageLoading || imageError) && (
        <div className="absolute inset-0 z-10">
          {fallbackElement || defaultFallback}
        </div>
      )}
      {/* Use Next.js Image component for optimization */}
      {!imageError && (
        <>
          <Image
            src={normalizedSrc}
            alt={alt}
            className={`${className} absolute inset-0 w-full h-full ${objectFitClass} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 z-20`}
            fill
            sizes="100vw"
            priority={priority}
            onError={() => {
              console.warn('Image failed to load:', normalizedSrc);
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => {
              console.log('=== IMAGE LOADED SUCCESSFULLY ===');
              console.log('Loaded image:', normalizedSrc);
              setImageLoading(false);
            }}
            unoptimized // Remove this line if you want Next.js to optimize remote images
          />
        </>
      )}
    </div>
  );
};

export default ArticleImageEnhanced;