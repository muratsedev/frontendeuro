# Dynamic Category Components Documentation

This document explains the new dynamic category components that display articles with a **big image on the right** and **four small images on the left** layout.

## 🎨 New Components Overview

### 1. DynamicCategorySection.tsx
The main component that displays a single category with the dynamic layout:
- **1 Big Image** (right side) - Featured article with overlay text
- **4 Small Images** (left side) - Grid of 2x2 articles

### 2. DynamicCategoriesGrid.tsx
Container component for displaying multiple dynamic categories.

### 3. FeaturedDynamicCategories.tsx
Homepage section component for showcasing selected categories with the dynamic layout.

## 🔧 Layout Structure

```
┌─────────────────────────────────────────┐
│           Category Header               │
│         (Green Background)              │
├─────────────────┬───────────────────────┤
│ Small 1│Small 2 │                      │
│        │        │                      │
├────────┼────────┤    Big Featured      │
│ Small 3│Small 4 │      Article         │
│        │        │                      │
└─────────────────┴───────────────────────┘
```

## 📊 Key Features

### ✅ **Perfect RTL Layout**
- Big image positioned on the right (as requested)
- Small images grid on the left
- Arabic text aligned properly

### ✅ **Responsive Design**
- **Desktop**: Big right + Small left grid
- **Tablet**: Single column with big image first
- **Mobile**: Stacked layout

### ✅ **Enhanced Styling**
- Custom CSS grid system for perfect positioning
- Enhanced overlays for better text readability
- Smooth hover animations
- Professional shadows and borders

## 🚀 Usage Examples

### Basic Dynamic Category Display
```tsx
import DynamicCategorySection from '../components/DynamicCategorySection';

function CategoryPage({ category }) {
  return (
    <DynamicCategorySection 
      category={category}
      showHeader={true}
      showViewAll={true}
    />
  );
}
```

### Multiple Dynamic Categories
```tsx
import DynamicCategoriesGrid from '../components/DynamicCategoriesGrid';

function DynamicCategoriesPage({ categories }) {
  return (
    <DynamicCategoriesGrid 
      categories={categories}
      maxCategories={6}
      title="التصنيفات الديناميكية"
    />
  );
}
```

### Homepage Featured Section
```tsx
import FeaturedDynamicCategories from '../components/FeaturedDynamicCategories';

function Homepage({ categories }) {
  return (
    <FeaturedDynamicCategories
      categories={categories}
      maxCategories={3}
      title="أحدث الأخبار"
      showViewAllButton={true}
    />
  );
}
```

## 📱 Component Props

### DynamicCategorySection Props
```typescript
interface DynamicCategorySectionProps {
  category: CategoryWithArticles;
  showHeader?: boolean;        // Default: true
  showViewAll?: boolean;       // Default: true
  className?: string;          // Additional CSS classes
}
```

### DynamicCategoriesGrid Props
```typescript
interface DynamicCategoriesGridProps {
  categories: CategoryWithArticles[];
  maxCategories?: number;      // Default: 4
  showHeaders?: boolean;       // Default: true
  showViewAllLinks?: boolean;  // Default: true
  title?: string;              // Default: "الأقسام الرئيسية"
  className?: string;
}
```

### FeaturedDynamicCategories Props
```typescript
interface FeaturedDynamicCategoriesProps {
  categories: CategoryWithArticles[];
  maxCategories?: number;      // Default: 2
  title?: string;              // Default: "الأقسام المميزة"
  showViewAllButton?: boolean; // Default: true
  className?: string;
}
```

## 🎨 CSS Classes Added

### Grid System
```css
.dynamic-grid              /* Main container: 1fr 2fr grid */
.small-articles-grid       /* Left side: 2x2 grid for small articles */
.big-article-container     /* Right side: container for big article */
.small-article-container   /* Individual small article containers */
```

### Enhanced Overlays
```css
.enhanced-overlay          /* Better gradient for big article */
.small-overlay            /* Subtle gradient for small articles */
```

### Typography
```css
.dynamic-big-title        /* Large title for featured article */
.dynamic-small-title      /* Smaller titles for grid articles */
```

## 📁 File Structure

```
src/
├── components/
│   ├── DynamicCategorySection.tsx      # Main dynamic layout
│   ├── DynamicCategoriesGrid.tsx       # Multiple categories
│   └── FeaturedDynamicCategories.tsx   # Homepage section
├── app/
│   ├── dynamic-categories/
│   │   └── page.tsx                    # Dynamic categories page
│   ├── page-dynamic.tsx                # Enhanced homepage
│   └── globals.css                     # Enhanced CSS
```

## 🌐 Pages Available

### `/dynamic-categories`
- Shows all categories using the dynamic layout
- Perfect for showcasing the new design

### Homepage Options
1. **`page-dynamic.tsx`** - Enhanced homepage with dynamic categories
2. **Original `page.tsx`** - Your existing homepage

## 📱 Responsive Behavior

### Desktop (1024px+)
- Big image on right (2/3 width)
- 4 small images on left (1/3 width) in 2x2 grid
- 400px height container

### Tablet (768px - 1024px)
- Single column layout
- Big image first (300px height)
- Small images in 2x2 grid below

### Mobile (< 768px)
- Single column stack
- Big image first (250px height)
- Small images in single column
- Reduced text sizes

## 🔄 Data Requirements

The dynamic layout works best with categories that have **at least 5 articles**:
- 1 for the big featured position
- 4 for the small grid positions

Categories with fewer articles will still work but won't fill all positions.

## 🎯 Best Use Cases

1. **Homepage Featured Section** - Show 2-3 top categories
2. **Category Overview Page** - Display all categories dynamically
3. **News Portals** - Perfect for news websites with rich imagery
4. **Magazine Layouts** - Great for content-heavy sites

## 🔧 Customization

### Change Grid Ratio
Modify the CSS grid in `globals.css`:
```css
.dynamic-grid {
  grid-template-columns: 1fr 2fr; /* Change ratio here */
}
```

### Adjust Height
```css
.dynamic-grid {
  height: 500px; /* Increase for larger display */
}
```

### Modify Overlay Intensity
```css
.enhanced-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,    /* Darker bottom */
    rgba(0, 0, 0, 0.3) 50%,   /* Adjust middle */
    transparent 100%
  );
}
```

This dynamic layout provides a modern, magazine-style approach to displaying category content with excellent visual hierarchy and user engagement!
