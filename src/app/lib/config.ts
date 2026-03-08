/**
 * Centralized configuration for the frontend application
 * This is the SINGLE SOURCE OF TRUTH for backend API URL
 */

/**
 * Get the backend API URL from environment or fallback to cloud production
 * @returns The backend API base URL
 */
export const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://euronews-001-site1.stempurl.com';
};

/**
 * Backend API base URL - Use this constant throughout the application
 */
export const BACKEND_API_URL = getBackendUrl();

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  articles: '/api/Articles',
  categories: '/api/Categories',
  uploads: '/uploads',
} as const;

/**
 * Image fetch configuration
 */
export const IMAGE_FETCH_CONFIG = {
  credentials: 'omit' as RequestCredentials,
  mode: 'cors' as RequestMode,
  cache: 'force-cache' as RequestCache,
  headers: {
    'Accept': 'image/*',
  },
};

/**
 * Check if a URL is a backend URL
 */
export const isBackendUrl = (url: string): boolean => {
  if (!url) return false;
  const backendUrl = getBackendUrl();
  return url.includes(backendUrl.replace('https://', '').replace('http://', ''));
};

/**
 * Check if a URL is a relative path that should use backend
 */
export const isRelativePath = (url: string): boolean => {
  if (!url) return false;
  return !url.startsWith('http://') && !url.startsWith('https://');
};
