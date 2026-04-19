"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImageSource } from '../app/lib/imageHelpers';

interface ArticleImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackElement?: React.ReactNode;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  position?: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt,
  className = "",
  fallbackElement,
  fit = 'cover',
  position = 'center'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Check if we have a valid image source
  const hasValidSrc = Boolean(src && src.trim() && !imageError);

  // Normalize image path through proxy-aware helper
  const normalizedSrc = hasValidSrc ? getImageSource(src.trim()) : '';
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);
  const hasRenderableSrc = Boolean(currentSrc && currentSrc.trim());

  useEffect(() => {
    setCurrentSrc(normalizedSrc);
    setImageError(false);
    setImageLoading(true);
  }, [normalizedSrc]);

  // Default fallback
  const defaultFallback = (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-white text-center p-8">
        <div className="text-4xl mb-4">📰</div>
        <p className="text-lg">مقال مميز جيد</p>
      </div>
    </div>
  );




  if (!hasValidSrc || !hasRenderableSrc) {
    console.log('ArticleImage: Showing fallback due to invalid src');
    return fallbackElement || defaultFallback;
  }

  console.log('=== RENDERING IMAGE ===');
  console.log('Using normalized src:', currentSrc);
  console.log('hasValidSrc:', hasValidSrc);
  console.log('imageError:', imageError);
  console.log('imageLoading:', imageLoading);

  return (
    <div className="relative w-full h-full">
      {/* Show fallback while loading or if error */}
      {(imageLoading || imageError) && (
        <div className="absolute inset-0 z-10">
          {fallbackElement || defaultFallback}
        </div>
      )}
      {/* Use Next.js Image component for optimization */}
      {!imageError && hasRenderableSrc && (
        <>
              <Image
                src={currentSrc}
                alt={alt}
                className={`${className} absolute inset-0 w-full h-full ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 z-20`}
                style={{ objectFit: (fit || 'cover') as React.CSSProperties['objectFit'], objectPosition: position || 'center' }}
                fill
                sizes="100vw"
                onError={() => {
                  console.warn('Image failed to load:', currentSrc);
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => {
                  console.log('=== IMAGE LOADED SUCCESSFULLY ===');
                  console.log('Loaded image:', currentSrc);
                  setImageLoading(false);
                }}
                unoptimized // Remove this line if you want Next.js to optimize remote images
              />
        </>
      )}
    </div>
  );
};

export default ArticleImage;
