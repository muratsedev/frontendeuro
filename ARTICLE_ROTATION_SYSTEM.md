# 🔄 Article Rotation System Documentation

## Overview
The Article Rotation System automatically rotates articles within the DynamicCategorySection component when new articles are added. New articles immediately take the big image position, and existing articles cascade through smaller positions in a **counter-clockwise** direction.

## 🎯 How It Works

### Rotation Flow
When a new article is created and assigned to a category:
1. **New Article** → **Big Image** (right side)
2. **Previous Big** → **Top-Right Small** (position 1)
3. **Top-Right** → **Top-Left Small** (position 2)  
4. **Top-Left** → **Bottom-Left Small** (position 3)
5. **Bottom-Left** → **Bottom-Right Small** (position 4)
6. **Bottom-Right** → **Exits** (removed from display)

### Visual Positions
```
┌─────────────────┬─────────────┐
│ [2] Top-Left    │             │
├─────────────────┤    BIG      │
│ [3] Bottom-Left │   IMAGE     │
├─────────────────┤   (NEW)     │
│ [4] Bottom-Right│             │
├─────────────────┼─────────────┤
│ [1] Top-Right   │             │
└─────────────────┴─────────────┘
```

## 🔧 Technical Implementation

### Backend Changes
**File:** `backend/Controllers/ArticlesController.cs`
- Added `OrderByDescending(a => a.CreatedDate)` to both:
  - `GetArticles()` endpoint  
  - `GetArticlesByCategory()` endpoint
- Ensures newest articles appear first automatically

### Frontend Components

#### 1. DynamicCategorySection.tsx (Enhanced)
- **Location:** `src/components/DynamicCategorySection.tsx`
- **Features:**
  - Automatic article sorting by creation date
  - Integration with `useArticleRotation` hook
  - Animation-aware rendering
  - Position-specific CSS classes

#### 2. useArticleRotation Hook
- **Location:** `src/hooks/useArticleRotation.ts`
- **Purpose:** Detects article changes and manages rotation animations
- **Key Features:**
  - Automatic rotation detection
  - Animation state management
  - Position mapping
  - Counter-clockwise flow logic

#### 3. Animation CSS
- **Location:** `src/app/globals.css`
- **Animations:**
  - `rotateCounterClockwise`: Base rotation animation
  - `slideFromBig`: Big → Top-Right transition
  - `slideToPosition`: Cascading position transitions
  - `fadeInFromRight`: New article entrance

### Demo Page
- **Location:** `/article-rotation-demo`
- **Features:**
  - Live rotation demonstration
  - Auto-refresh every 30 seconds
  - Manual refresh button
  - Instructions for testing

## 🚀 Usage

### Basic Implementation
```tsx
import DynamicCategorySection from '../components/DynamicCategorySection';

<DynamicCategorySection
  category={categoryWithArticles}
  showHeader={true}
  showViewAll={true}
  className="your-custom-styles"
/>
```

### Testing Article Rotation

#### Method 1: Add New Articles
1. Go to Dashboard → Articles
2. Create a new article
3. Select a category with existing articles
4. Publish the article
5. Visit the demo page to see rotation

#### Method 2: Use Demo Page
1. Navigate to `/article-rotation-demo`
2. View existing categories with articles
3. Add new articles via dashboard
4. Return to see automatic rotation

## 🎨 Animation Details

### Animation Timing
- **Duration:** 1 second per rotation
- **Easing:** `ease-in-out` for smooth transitions
- **Stagger:** 0.1s delay between positions for wave effect

### Visual Indicators
- **New Articles:** Green pulse indicator (🆕)
- **Rotating Articles:** Blue pulse dots
- **Animation Classes:** Applied automatically during rotation

### CSS Classes
```css
/* Main animation trigger */
.article-rotation-animation {
  animation: rotateCounterClockwise 1s ease-in-out;
}

/* Position-specific animations */
.rotate-to-big { animation: fadeInFromRight 1s ease-out; }
.rotate-to-top-right { animation: slideFromBig 1s ease-out; }
.rotate-to-top-left { animation: slideToPosition 1s ease-out 0.1s both; }
.rotate-to-bottom-left { animation: slideToPosition 1s ease-out 0.2s both; }
.rotate-to-bottom-right { animation: slideToPosition 1s ease-out 0.3s both; }
```

## 📱 Responsive Behavior

### Desktop (>1024px)
- Side-by-side layout: Big image right, 4 small images left
- Full animation effects
- Smooth transitions

### Tablet (768px-1024px)
- Stacked layout: Big image top, small images in 2x2 grid
- Reduced animation duration

### Mobile (<768px)
- Vertical stack: All images full width
- Simplified animations
- Touch-friendly interactions

## 🔍 Debugging

### Console Logging
The system provides detailed console logs:
```javascript
// Rotation detection
🔄 Article rotation detected: {categoryId, hasNewTopArticle, newArticleIds}

// Image fetching
BigArticle - Fetching image: /uploads/image.jpg
SmallArticle - Blob created, size: 45231, type: image/jpeg
```

### Common Issues

#### No Rotation Happening
- Check if articles are sorted by `createdDate` DESC
- Verify `useArticleRotation` hook is properly imported
- Ensure backend API returns `OrderByDescending` data

#### Images Not Loading
- Check CORS settings in backend
- Verify image paths are properly encoded
- Check network requests in browser dev tools

## 🛠️ Configuration

### Customizing Rotation Speed
```typescript
// In useArticleRotation.ts
setTimeout(() => {
  setRotationState(prev => ({ ...prev, isRotating: false }));
}, 1200); // Change this value (milliseconds)
```

### Changing Max Articles
```tsx
<DynamicCategorySection
  category={category}
  // Hook automatically limits to 5, but can be configured
/>
```

### Custom Animation Duration
```css
/* In globals.css */
.article-rotation-animation {
  animation: rotateCounterClockwise 2s ease-in-out; /* Change duration */
}
```

## 🔄 Integration with Existing Components

The rotation system is backward-compatible with existing implementations:

### MainUp Component
- No changes needed
- Uses fixed UpperArticle positions

### CategorySection Component  
- Standard grid layout
- No rotation animations

### DynamicCategorySection
- ✅ **Enhanced with rotation**
- ✅ **Automatic article sorting**
- ✅ **Animation support**

## 📊 Performance Considerations

### Optimization Features
- **Efficient re-renders:** Only animates when articles change
- **Automatic cleanup:** Animation states reset after completion
- **Image optimization:** Blob handling for better caching
- **Memory management:** Object URL cleanup prevents leaks

### Best Practices
- Use `React.memo()` for article cards if needed
- Consider virtualization for categories with many articles
- Monitor bundle size with animation CSS

## 🚧 Future Enhancements

### Planned Features
1. **Real-time WebSocket updates** for instant rotation
2. **Drag-and-drop reordering** for manual positioning
3. **Custom animation presets** (clockwise, fade, slide, etc.)
4. **Admin controls** for rotation speed and behavior
5. **Analytics tracking** for article engagement by position

### Extension Points
```typescript
// Extensible hook design
const rotation = useArticleRotation({
  articles,
  categoryId,
  maxArticles: 5,
  // Future options:
  rotationDirection: 'counter-clockwise', // or 'clockwise'
  animationPreset: 'smooth', // or 'fast', 'bounce'
  autoRotationInterval: 30000, // milliseconds
});
```

## 📞 Support & Troubleshooting

### Quick Checklist
- ✅ Backend API sorts by `CreatedDate DESC`
- ✅ Frontend hook properly imported
- ✅ CSS animations added to `globals.css`
- ✅ Demo page accessible at `/article-rotation-demo`

### Testing Commands
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Start development server
npm run dev

# Build for production
npm run build
```

---

🎉 **The Article Rotation System is now ready!** Create new articles to see the automatic counter-clockwise rotation in action.