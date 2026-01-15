# Article Routing with Category Names and GUIDs

## Overview

This implementation creates SEO-friendly URLs for articles that include both category names and article GUIDs, improving both user experience and search engine optimization.

## URL Structure

### New Format
- **SEO-friendly**: `/{category-slug}/{article-title-slug}-{article-guid}`
- **Example**: `/technology/new-ai-breakthrough-12345678-1234-1234-1234-123456789012`

### Old Format (Redirected)
- **Simple**: `/article/{article-guid}`
- **Example**: `/article/12345678-1234-1234-1234-123456789012`

## Implementation Details

### Files Created/Modified

1. **`/app/[category]/[slug]/page.tsx`** - New article page with category routing
2. **`/app/lib/urlUtils.ts`** - Utility functions for URL generation and slug creation
3. **`/middleware.ts`** - Handles redirects from old URLs to new format
4. **`/components/ArticleCard.tsx`** - Updated to use new URL format
5. **`/app/article/[id]/page.tsx`** - Modified to redirect to new format

### Key Features

#### 1. Automatic Redirects
- Old URLs `/article/{id}` automatically redirect to new format
- Preserves SEO and existing bookmarks
- Handles both direct navigation and middleware redirects

#### 2. URL Validation
- Validates category and article slug format
- Redirects to correct URL if format doesn't match
- Handles missing or invalid articles gracefully

#### 3. Breadcrumb Navigation
- Shows hierarchy: Home > Category > Article
- Clickable breadcrumbs for better navigation
- Responsive design for mobile devices

#### 4. SEO Improvements
- Category names in URL for better context
- Article titles in URL for keyword relevance
- Proper meta tags and structured data ready

## Usage Examples

### Generating Article URLs

```typescript
import { generateArticleUrl } from '../app/lib/urlUtils';

// With category information
const url = generateArticleUrl(article, category);
// Result: /technology/ai-breakthrough-12345678-1234-1234-1234-123456789012

// Without category (fallback)
const url = generateArticleUrl(article);
// Result: /article/12345678-1234-1234-1234-123456789012
```

### Using in Components

```typescript
// ArticleCard component
<ArticleCard 
  article={article} 
  category={category} 
  variant="default" 
/>
```

### URL Structure Components

1. **Category Slug**: 
   - Uses `category.categorySlug` if available
   - Falls back to generated slug from `category.name`
   - Example: "تكنولوجيا" → "تكنولوجيا" or "technology"

2. **Article Slug**:
   - Format: `{article-title-slug}-{article-guid}`
   - Handles Arabic text properly
   - Example: "اختراق جديد في الذكاء الاصطناعي" → "اختراق-جديد-في-الذكاء-الاصطناعي-12345678-1234-1234-1234-123456789012"

## Error Handling

### Article Not Found
- Shows user-friendly error message
- Provides navigation options (back button, home link)
- Logs error for debugging

### Category Mismatch
- Validates article belongs to specified category
- Redirects to correct category if mismatch
- Handles missing categories gracefully

### Invalid URLs
- Extracts GUID from various slug formats
- Handles malformed URLs gracefully
- Provides fallback navigation

## Performance Considerations

### Caching
- Article and category data fetched once per page load
- Redirects happen client-side for better UX
- Consider implementing server-side caching for production

### Database Queries
- Fetches all articles/categories initially (consider pagination for large datasets)
- Could be optimized with specific API endpoints
- Consider implementing search indexing for better performance

## Future Enhancements

### Possible Improvements
1. **Server-side rendering** for better SEO
2. **Static generation** for popular articles
3. **Sitemap generation** with new URL format
4. **Analytics tracking** for URL performance
5. **Multi-language support** for slugs

### Database Schema Considerations
- Add `slug` column to categories table
- Add `slug` column to articles table
- Implement slug generation on article creation
- Add unique constraints for slug fields

## Testing

### URL Scenarios to Test
1. Direct navigation to new format URLs
2. Old URL redirects
3. Invalid article IDs
4. Missing categories
5. Malformed URLs
6. Arabic text in titles
7. Special characters handling

### Browser Compatibility
- Tested with modern browsers
- Handles URL encoding properly
- Mobile-responsive design

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- Consider adding `ENABLE_URL_REDIRECTS` for feature flagging

### Next.js Configuration
- Middleware handles URL pattern matching
- Dynamic routes configured properly
- Static file serving not affected
