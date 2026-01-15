import { useState, useEffect } from 'react';
import { fetchImageAsBlob, getImageSource } from '../app/lib/imageHelpers';

/**
 * Custom hook for loading images with blob fallback
 * @param imagePath - The image path to load
 * @returns Object with image source and blob flag
 */
export const useImageLoader = (imagePath: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isBlob, setIsBlob] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    const loadImage = async () => {
      if (!imagePath) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      // Try to fetch as blob first
      const blobUrl = await fetchImageAsBlob(imagePath);
      
      if (blobUrl) {
        objectUrl = blobUrl;
        setImgSrc(blobUrl);
        setIsBlob(true);
      } else {
        // Fallback to direct URL
        const directUrl = getImageSource(imagePath);
        setImgSrc(directUrl);
        setIsBlob(false);
      }
      
      setIsLoading(false);
    };
    
    loadImage();
    
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagePath]);

  return { imgSrc, isBlob, isLoading };
};
