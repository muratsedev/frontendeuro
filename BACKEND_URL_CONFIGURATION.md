# Backend API Configuration Guide

## Quick Configuration

To change the backend API URL for your entire frontend application, you only need to update **ONE FILE**:

### 📁 `.env.local`

```bash
NEXT_PUBLIC_API_URL=https://eennback-002-site1.atempurl.com
```

That's it! Change this URL to point to your backend server and restart your development server.

---

## How It Works

The application uses a centralized configuration system with **automatic CORS handling**:

### 1. **Environment Variable** (`.env.local`)
- Defines `NEXT_PUBLIC_API_URL`
- This is the **SINGLE SOURCE OF TRUTH** for the backend URL

### 2. **Centralized Config** (`src/app/lib/config.ts`)
- Exports `BACKEND_API_URL` constant
- All application code imports from here
- Falls back to production URL if env variable is not set

### 3. **Image Proxy** (`next.config.ts`)
- Automatically proxies backend images through `/backend-images/*`
- **Eliminates CORS errors** by routing requests through Next.js server
- Transparent to your components - just works!

### 4. **All Components Use The Same Config**
- `src/app/lib/api.ts` - API calls
- `src/app/lib/imageHelpers.ts` - Image loading (with automatic proxy)
- `src/hooks/useImageLoader.ts` - Image hook
- All other components import from these

---

## Configuration Files Reference

### Primary Configuration
```
.env.local                          ← Change backend URL here!
└── src/app/lib/config.ts           ← Centralized config (reads from .env.local)
    ├── src/app/lib/api.ts          ← API calls
    ├── src/app/lib/imageHelpers.ts ← Image utilities
    └── src/hooks/useImageLoader.ts  ← Image loading hook
```

### Component Usage
All components use the centralized configuration through:
- `useImageLoader` hook for images
- `articlesApi` / `categoriesApi` for data

---

## Examples

### Development (Local Backend)
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://localhost:7065
```

### Production (Cloud Backend)
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://eennback-002-site1.atempurl.com
```

### Custom Server
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Important Notes

1. **Restart Required**: After changing `.env.local`, restart your development server:
   ```bash
   npm run dev
   ```

2. **Build Process**: For production builds, make sure your `.env.local` or `.env.production` is configured:
   ```bash
   npm run build
   ```

3. **Never Commit**: `.env.local` should be in `.gitignore` (it already is)

4. **Fallback**: If no environment variable is set, the app falls back to:
   ```
   https://eennback-002-site1.atempurl.com
   ```

---

## Troubleshooting

### Images Not Loading?
1. Check `.env.local` has the correct backend URL
2. **Restart development server** (IMPORTANT after .env changes!)
3. Clear browser cache
4. Check browser console for errors
5. Verify backend is accessible at the configured URL

### API Calls Failing?
1. Verify backend server is running
2. Check CORS configuration on backend
3. Verify SSL/HTTPS settings
4. Check network tab in browser dev tools

### CORS Errors Fixed! 🎉
The app now uses Next.js as a proxy for images, which means:
- ✅ No more "blocked by CORS policy" errors
- ✅ Images load from `/backend-images/*` proxy path
- ✅ Automatic routing to your backend
- ✅ Works with any backend URL you configure

### Environment Variable Not Working?
1. Must start with `NEXT_PUBLIC_` to be accessible in browser
2. Restart dev server after changes
3. Check file is named exactly `.env.local`
4. File should be in project root directory

---

## Benefits of This System

✅ **Single Point of Configuration** - Change URL in one place  
✅ **Environment-Specific** - Different URLs for dev/prod  
✅ **Type-Safe** - TypeScript support throughout  
✅ **Consistent** - All components use same configuration  
✅ **Maintainable** - Easy to update and manage  

---

## For Developers

If you need to add new API endpoints or image sources, always:

1. Import from `src/app/lib/config.ts`:
   ```typescript
   import { BACKEND_API_URL } from '../app/lib/config';
   ```

2. Use helper functions when possible:
   ```typescript
   import { fetchImageAsBlob, getImageSource } from '../app/lib/imageHelpers';
   import { useImageLoader } from '../hooks/useImageLoader';
   ```

3. Never hardcode URLs in components!

---

Last updated: November 2, 2025
