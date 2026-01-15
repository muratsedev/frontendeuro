# Featured Upper Articles Components

This documentation explains how to use the featured article components that display articles with specific `upperArticleId` values.

## Components Overview

### 1. FeaturedUpperArticle
A large, full-width hero component that displays one featured article prominently.

### 2. CompactFeaturedUpperArticle  
A grid-based component that displays multiple featured articles in a compact layout.

### 3. useUpperArticles Hook
A custom hook for fetching articles with specific `upperArticleId` values.

## Usage Examples

### Basic Usage - Featured Article with upperArticleId = 5

```tsx
import FeaturedUpperArticle from "../components/FeaturedUpperArticle";

// Display the most recent article with upperArticleId = 5
<FeaturedUpperArticle />
```

### Custom upperArticleId

```tsx
// Display featured article with upperArticleId = 3
<FeaturedUpperArticle upperArticleId={3} />
```

### Compact Layout for Multiple Articles

```tsx
import CompactFeaturedUpperArticle from "../components/CompactFeaturedUpperArticle";

// Display 3 articles with upperArticleId = 5
<CompactFeaturedUpperArticle limit={3} />

// Display 6 articles with upperArticleId = 2
<CompactFeaturedUpperArticle upperArticleId={2} limit={6} />
```

### Using the Hook Directly

```tsx
import { useUpperArticles } from "../hooks/useUpperArticles";

function MyComponent() {
  const { articles, categories, loading, error } = useUpperArticles({
    upperArticleId: 5,
    limit: 10,
    includeCategories: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.articleTitle}</div>
      ))}
    </div>
  );
}
```

## Component Props

### FeaturedUpperArticle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `showBadge` | `boolean` | `true` | Show the "مميز" (Featured) badge |
| `upperArticleId` | `number` | `5` | The upperArticleId to filter articles by |

### CompactFeaturedUpperArticle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `limit` | `number` | `3` | Maximum number of articles to display |
| `upperArticleId` | `number` | `5` | The upperArticleId to filter articles by |

### useUpperArticles Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `upperArticleId` | `number` | Required | The upperArticleId to filter by |
| `limit` | `number` | `undefined` | Limit the number of articles returned |
| `includeCategories` | `boolean` | `true` | Whether to fetch category data |

## Features

### 🎨 Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### 🖼️ Image Handling
- Automatic fallback for missing images
- Optimized image loading with Next.js Image component
- Gradient placeholders for articles without images

### 🏷️ Rich Metadata Display
- Category badges
- Publication dates in Arabic format
- Social media indicators (Facebook, Twitter)
- Upper article names as special tags

### 🔗 Smart URL Generation
- SEO-friendly URLs with category names
- Automatic fallback to simple article IDs
- Proper routing integration

### ⚡ Performance Optimized
- Efficient data fetching with custom hooks
- Automatic sorting by publication date
- Published-only article filtering

## Integration Examples

### Main Homepage

```tsx
// src/app/page.tsx
import FeaturedUpperArticle from "../components/FeaturedUpperArticle";
import CompactFeaturedUpperArticle from "../components/CompactFeaturedUpperArticle";

export default function HomePage() {
  return (
    <div>
      {/* Hero section with main featured article */}
      <FeaturedUpperArticle className="mb-8" />
      
      {/* Additional featured articles */}
      <CompactFeaturedUpperArticle limit={6} className="mb-12" />
      
      {/* Other content */}
    </div>
  );
}
```

### Category Pages

```tsx
// Show featured articles from specific category
<CompactFeaturedUpperArticle 
  upperArticleId={3} 
  limit={4}
  className="mb-8"
/>
```

### Conditional Display

```tsx
import { useHasUpperArticles } from "../hooks/useUpperArticles";

function ConditionalFeatured() {
  const { hasArticles, loading } = useHasUpperArticles(5);
  
  if (loading) return <div>Checking for featured articles...</div>;
  
  return (
    <div>
      {hasArticles && <FeaturedUpperArticle />}
    </div>
  );
}
```

## Styling

The components use Tailwind CSS with custom styles defined in `globals.css`:

- `.text-shadow-lg` - Large text shadow for better readability
- `.line-clamp-2`, `.line-clamp-3` - Text truncation utilities
- Arabic date formatting
- RTL-friendly layouts

## Data Requirements

Articles must have the following structure:

```typescript
interface AllArticles {
  id: string;
  articleTitle: string;
  articleSummary: string;
  articleContent: string;
  imagePath: string;
  createdDate: Date;
  updatedDate: Date;
  isPublished: boolean;
  facebook: boolean;
  twitter: boolean;
  categoryId: number;
  tagId: number;
  tagName: string;
  upperArticleId: number;      // Key field for filtering
  upperArticleName: string;    // Displayed as special tag
  podcastTypeId: number;
  podcastName: string;
}
```

## Common upperArticleId Values

Based on your backend structure, you might have:

- `upperArticleId: 5` - Main featured articles (default)
- `upperArticleId: 1` - Breaking news
- `upperArticleId: 2` - Editor's picks
- `upperArticleId: 3` - Trending articles
- etc.

You can customize which `upperArticleId` to display by passing it as a prop to any component.

## Troubleshooting

### No Articles Displayed
- Check that articles exist with the specified `upperArticleId`
- Ensure articles have `isPublished: true`
- Verify API connectivity

### Images Not Loading
- Check `imagePath` values in your articles
- Ensure image URLs are accessible
- Fallback gradients will display automatically

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check that custom CSS classes are defined in `globals.css`
- Ensure responsive breakpoints are working
