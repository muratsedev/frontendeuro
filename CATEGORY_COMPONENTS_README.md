# Category Components Documentation

This document explains the new category components that display articles grouped by categories in a magazine-style layout, inspired by the provided design image.

## Components Overview

### 1. CategorySection.tsx
The main component that displays a single category with its articles in a magazine-style layout.

**Features:**
- Green header with category name and "المزيد" link
- Featured article layout with large image and overlay text
- Standard article cards with images and summaries
- Compact article cards for additional content
- Responsive design for different screen sizes

**Props:**
```typescript
interface CategorySectionProps {
  category: CategoryWithArticles;
  maxArticles?: number; // Default: 6
  showViewAll?: boolean; // Default: true
}
```

### 2. CategoriesGrid.tsx
A container component that displays multiple categories in a grid layout.

**Props:**
```typescript
interface CategoriesGridProps {
  categories: CategoryWithArticles[];
  maxArticlesPerCategory?: number; // Default: 6
  showViewAllLinks?: boolean; // Default: true
}
```

### 3. FeaturedCategories.tsx
A section component for homepage use that displays selected categories.

**Props:**
```typescript
interface FeaturedCategoriesProps {
  categories: CategoryWithArticles[];
  maxCategories?: number; // Default: 3
  maxArticlesPerCategory?: number; // Default: 4
  title?: string; // Default: "التصنيفات المميزة"
  showViewAllButton?: boolean; // Default: true
}
```

## Article Card Variants

### Featured Variant
- Large image with overlay text
- Title and summary over the image
- Used for the main article in each category

### Standard Variant
- Medium-sized card with image on top
- Title, summary, and date below
- Used for secondary articles

### Compact Variant
- Small horizontal layout
- Thumbnail image on the right (RTL)
- Title and date only
- Used for additional articles

## Usage Examples

### Basic Category Display
```tsx
import CategorySection from '../components/CategorySection';

function CategoryPage({ category }) {
  return (
    <CategorySection 
      category={category}
      maxArticles={10}
      showViewAll={true}
    />
  );
}
```

### Multiple Categories Grid
```tsx
import CategoriesGrid from '../components/CategoriesGrid';

function AllCategoriesPage({ categories }) {
  return (
    <CategoriesGrid 
      categories={categories}
      maxArticlesPerCategory={6}
      showViewAllLinks={true}
    />
  );
}
```

### Homepage Featured Categories
```tsx
import FeaturedCategories from '../components/FeaturedCategories';

function Homepage({ categories }) {
  return (
    <div>
      {/* Other homepage content */}
      
      <FeaturedCategories
        categories={categories}
        maxCategories={3}
        maxArticlesPerCategory={5}
        title="أحدث الأخبار"
        showViewAllButton={true}
      />
    </div>
  );
}
```

## Data Structure

### CategoryWithArticles Type
```typescript
export type CategoryWithArticles = {
  id: number;
  name: string;
  categorySlug: string;
  isActivated: boolean;
  articles: Article[];
};
```

### Article Type
```typescript
export type Article = {
  id: string;
  articleTitle: string;
  articleSummary: string;
  articleContent: string;
  imagePath: string;
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  categoryId: number;
};
```

## API Integration

The components expect data from the `/api/categories-with-articles` endpoint. The API should return an array of categories with their associated articles.

## Styling

The components use:
- **Primary Color**: `oklch(52.7% 0.154 150.069)` (green theme)
- **Tailwind CSS** for responsive design
- **Custom CSS classes** in `globals.css` for enhanced styling
- **RTL support** for Arabic content

## Pages

### /categories
Shows all categories with their articles using `CategoriesGrid`.

### /categories/[slug]
Shows a single category with all its articles using `CategorySection`.

## Responsive Behavior

- **Desktop**: Full magazine layout with featured articles
- **Tablet**: Adjusted grid with 2-column layout
- **Mobile**: Single column stack layout
- **RTL**: Right-to-left text alignment for Arabic content

## CSS Classes Added

```css
.category-card - Enhanced shadow and hover effects
.article-card-overlay - Gradient overlay for featured articles
.category-title - Responsive category title sizing
.article-title-featured - Featured article title styling
.article-title-standard - Standard article title styling
```

## File Structure

```
src/
├── components/
│   ├── CategorySection.tsx      # Main category display component
│   ├── CategoriesGrid.tsx       # Multiple categories container
│   └── FeaturedCategories.tsx   # Homepage featured section
├── app/
│   ├── categories/
│   │   ├── page.tsx             # All categories page
│   │   └── [slug]/
│   │       └── page.tsx         # Single category page
│   ├── globals.css              # Enhanced styles
│   └── page-with-categories.tsx # Enhanced homepage example
```

This implementation provides a complete magazine-style category system that matches the design shown in your reference image, with proper RTL support and responsive behavior.
