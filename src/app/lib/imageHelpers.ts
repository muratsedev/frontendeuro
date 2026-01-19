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
  const apiDomain = apiUrl.replace('https://', '').replace('http://', '');
  
  console.log('🔍 normalizeImageUrl:', { imagePath, apiUrl, apiDomain });
  
  // Check if the URL contains our backend domain (even if protocol differs)
  const containsBackendDomain = imagePath.includes(apiDomain);
  
  // Also check for localhost URLs (from old configuration)
  const isLocalhostUrl = imagePath.includes('localhost:5094') || imagePath.includes('localhost:5094');
  
  // If it's localhost, convert to proxy path by extracting just the path part
  if (isLocalhostUrl) {
    // Extract path after localhost:PORT
    const localhostMatch = imagePath.match(/localhost:\d+(.+)/);
    if (localhostMatch) {
      const path = localhostMatch[1];
      console.log('🔧 Converting localhost URL to proxy:', imagePath, '→', `/backend-images${path}`);
      return `/backend-images${path}`;
    }
  }
  
  // If it's a backend URL (full or contains backend domain), convert to proxy path
  if (imagePath.startsWith(apiUrl) || containsBackendDomain) {
    // Extract the path after the domain
    let path = imagePath.replace(apiUrl, '');
    
    // If it still has protocol (http/https), extract just the path part
    if (path.includes(apiDomain)) {
      const urlParts = path.split(apiDomain);
      path = urlParts[urlParts.length - 1];
    }
    
    console.log('🔄 Converting backend URL to proxy:', imagePath, '→', `/backend-images${path}`);
    return `/backend-images${path}`;
  }
  
  // If it's a full external URL (not our backend), return as is
  if (/^https?:\/\//.test(imagePath)) {
    console.log('🌐 Using external URL as-is:', imagePath);
    return imagePath;
  }
  
  // For relative paths, use proxy path
  const result = `/backend-images${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  console.log('📁 Converting relative path to proxy:', imagePath, '→', result);
  return result;
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
  
  console.log('🖼️ getImageSource INPUT:', imagePath);
  console.log('🏢 Current API URL:', getApiUrl());
  
  const normalizedUrl = normalizeImageUrl(imagePath);
  
  console.log('✨ Normalized URL:', normalizedUrl);
  
  // Only encode if it's not already a proxy path (proxy paths are already handled)
  if (normalizedUrl.startsWith('/backend-images')) {
    // For proxy paths, encode only the filename part
    const parts = normalizedUrl.split('/');
    const filename = parts[parts.length - 1];
    const basePath = parts.slice(0, -1).join('/');
    const result = `${basePath}/${encodeURIComponent(filename)}`;
    console.log('✅ FINAL proxy path:', result);
    return result;
  }
  
  const result = encodeImageUrl(normalizedUrl);
  console.log('⚠️ FINAL direct URL (not proxied!):', result);
  return result;
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