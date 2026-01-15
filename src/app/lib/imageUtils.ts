/**
 * Utility functions for handling image URLs with proper encoding
 */

/**
 * Properly encode image URLs to handle spaces and special characters
 * @param url - The URL to encode (can be relative or absolute)
 * @returns Properly encoded URL
 */
export const encodeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's a relative path, convert to absolute first
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
    url = `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  try {
    const urlObj = new URL(url);
    // Simple replacement of spaces with %20 in the pathname
    urlObj.pathname = urlObj.pathname.replace(/ /g, '%20');
    return urlObj.toString();
  } catch (error) {
    console.error('Failed to encode URL:', url, error);
    // Fallback to simple space replacement
    return url.replace(/ /g, '%20');
  }
};

/**
 * Encode only the filename/path part (for relative paths)
 * @param path - Relative path to encode
 * @returns Encoded path
 */
export const encodeImagePath = (path: string): string => {
  if (!path) return '';
  return path.replace(/ /g, '%20');
};

/**
 * Get full image URL with proper encoding for backend images
 * @param path - Image path (relative or absolute)
 * @returns Properly formatted and encoded URL
 */
export const getImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  
  // If already absolute (http/https), encode and return
  if (/^https?:\/\//.test(path)) {
    return encodeImageUrl(path);
  }
  
  // For relative paths, construct and encode the full URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
  const fullPath = `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  
  return encodeImageUrl(fullPath);
};

/**
 * Normalize image path for use with Next.js Image component
 * Handles relative and absolute paths with proper encoding
 * @param imagePath - The image path to normalize
 * @returns Normalized and encoded image URL
 */
export const normalizeImagePath = (imagePath: string): string => {
  console.log('=== NORMALIZING IMAGE PATH ===');
  console.log('Input imagePath:', imagePath);
  
  if (!imagePath) {
    console.log('Empty imagePath, returning empty string');
    return '';
  }
  
  // If it's already a full URL, encode it properly and return
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Already full URL, encoding and returning:', imagePath);
    const encodedUrl = encodeImageUrl(imagePath);
    console.log('Encoded URL:', encodedUrl);
    return encodedUrl;
  }
  
  // Get the backend URL from environment (fallback for old relative paths)
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://eennback-002-site1.atempurl.com';
  console.log('Backend URL from env:', backendUrl);
  
  let result: string;
  
  // If it starts with /uploads or similar backend paths, prepend backend URL
  if (imagePath.startsWith('/uploads') || imagePath.startsWith('/images') || imagePath.startsWith('/static')) {
    result = `${backendUrl}${imagePath}`;
    console.log('Backend path detected, constructed result:', result);
  }
  // If it starts with /, treat as absolute path from backend root
  else if (imagePath.startsWith('/')) {
    result = `${backendUrl}${imagePath}`;
    console.log('Absolute path detected, constructed result:', result);
  }
  // If it's a relative path, add backend URL and leading slash
  else {
    result = `${backendUrl}/${imagePath}`;
    console.log('Relative path detected, constructed result:', result);
  }
  
  // Properly encode the final URL
  const encodedResult = encodeImageUrl(result);
  console.log('Final encoded result:', encodedResult);
  return encodedResult;
};
