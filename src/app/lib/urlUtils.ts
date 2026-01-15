import { AllArticles, AllCategories } from '../types/Articles';

/**
 * Creates a URL-friendly slug from a string
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // Keep Arabic characters, words, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Generates a SEO-friendly URL for an article (simplified format)
 */
export const generateArticleUrl = (
  article: AllArticles, 
  category?: AllCategories
): string => {
  // Simplified format: just use the article ID without title
  const articleSlug = article.id;
  
  if (category) {
    const categorySlug = category.categorySlug || createSlug(category.name);
    return `/${categorySlug}/${articleSlug}`;
  }
  
  // Fallback to old format if no category provided
  return `/article/${article.id}`;
};

/**
 * Generates a category URL
 */
export const generateCategoryUrl = (category: AllCategories): string => {
  return `/category/${category.id}`;
};

/**
 * Extracts ID from a slug (assumes format: title-GUID)
 */
export const extractIdFromSlug = (slug: string): string | null => {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Check if last part is a GUID (8-4-4-4-12 pattern)
  const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (guidPattern.test(lastPart)) {
    return lastPart;
  }
  
  // If not a GUID, treat the whole slug as an ID
  return slug;
};

/**
 * Validates if a slug matches the expected format for an article (simplified)
 */
export const validateArticleSlug = (slug: string, article: AllArticles): boolean => {
  // Simple validation: slug should just be the article ID
  return slug === article.id;
};

/**
 * Validates if a category slug matches the expected format
 */
export const validateCategorySlug = (slug: string, category: AllCategories): boolean => {
  const expectedSlug = category.categorySlug || createSlug(category.name);
  return slug === expectedSlug;
};
