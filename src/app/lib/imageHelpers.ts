/**
 * Utility functions for robust image fetching and handling
 */

import { encodeImageUrl } from './imageUtils';
import { BACKEND_API_URL } from './config';

/**
 * Get the backend API URL from centralized config
 */
export const getApiUrl = (): string => {
  return BACKEND_API_URL;
};

/**
 * Normalize image path to a full URL
 * Uses proxy path for backend images to avoid CORS issues
 */
export const normalizeImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  const apiUrl = getApiUrl();
  
  // If already a full URL from our backend, convert to proxy path to avoid CORS
  if (imagePath.startsWith(apiUrl)) {
    // Extract the path after the domain
    const path = imagePath.replace(apiUrl, '');
    return `/backend-images${path}`;
  }
  
  // If it's a full external URL, return as is
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }
  
  // For relative paths, use proxy path
  return `/backend-images${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

/**
 * Fetch image as blob with proper error handling
 * NOTE: This may cause CORS issues in browser. Use getImageSource for direct URLs instead.
 * @param imagePath - Image path (relative or absolute)
 * @returns Promise that resolves to blob URL or null
 */
export const fetchImageAsBlob = async (imagePath: string): Promise<string | null> => {
  if (!imagePath) return null;
  
  // Skip blob fetching to avoid CORS issues - just return null
  // and let the component fall back to direct URL
  return null;
  
  /* CORS-problematic code disabled
  try {
    const fullUrl = normalizeImageUrl(imagePath);
    const encodedUrl = encodeImageUrl(fullUrl);
    
    console.log(`Fetching image: ${imagePath} -> ${encodedUrl}`);
    
    const response = await fetch(encodedUrl, IMAGE_FETCH_CONFIG);
    
    if (!response.ok) {
      console.warn(`Image fetch failed with status ${response.status}: ${encodedUrl}`);
      return null;
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error fetching image ${imagePath}:`, error);
    return null;
  }
  */
};

/**
 * Get image source with fallback handling
 * @param imagePath - Original image path
 * @returns Best available image source (uses proxy to avoid CORS)
 */
export const getImageSource = (imagePath: string): string => {
  if (!imagePath) return '';
  
  const normalizedUrl = normalizeImageUrl(imagePath);
  
  // Only encode if it's not already a proxy path (proxy paths are already handled)
  if (normalizedUrl.startsWith('/backend-images')) {
    // For proxy paths, encode only the filename part
    const parts = normalizedUrl.split('/');
    const filename = parts[parts.length - 1];
    const basePath = parts.slice(0, -1).join('/');
    return `${basePath}/${encodeURIComponent(filename)}`;
  }
  
  return encodeImageUrl(normalizedUrl);
};

/**
 * Check if an image path should be fetched as blob
 * @param imagePath - Image path to check
 * @returns True if should be fetched as blob
 */
export const shouldFetchAsBlob = (imagePath: string): boolean => {
  if (!imagePath) return false;
  
  const apiUrl = getApiUrl();
  
  // Fetch as blob if it's from our backend or contains /uploads/
  return (
    imagePath.includes(apiUrl.replace('https://', '').replace('http://', '')) ||
    imagePath.includes('/uploads/') ||
    imagePath.includes('/images/') ||
    imagePath.includes('/static/') ||
    !imagePath.startsWith('http')
  );
};

// Re-export encodeImageUrl for convenience
export { encodeImageUrl };