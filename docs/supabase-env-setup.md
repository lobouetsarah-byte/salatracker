# Supabase Environment Variable Setup

This guide explains how to properly configure Supabase environment variables for both web development and mobile (iOS/Android) builds.

---

## Overview

The app uses **Supabase** as its backend (authentication, database, and edge functions). To connect to Supabase, the app requires two environment variables:

1. **`VITE_SUPABASE_URL`** - Your Supabase project URL
2. **`VITE_SUPABASE_ANON_KEY`** - Your Supabase anonymous/public API key

These variables **MUST** be prefixed with `VITE_` so that Vite can expose them to the client-side code.

---

## Required Environment Variables

### `VITE_SUPABASE_URL`
- **Description**: The URL of your Supabase project
- **Format**: `https://[project-id].supabase.co`
- **Example**: `https://xoqtpirlztyemmiuktij.supabase.co`

### `VITE_SUPABASE_ANON_KEY`
- **Description**: The public/anonymous API key for your Supabase project
- **Format**: A JWT token string
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Where to Find Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Settings** (gear icon in sidebar)
4. Click on **API** in the settings menu
5. You'll find:
   - **Project URL** → Use this for `VITE_SUPABASE_URL`
   - **anon/public key** → Use this for `VITE_SUPABASE_ANON_KEY`

**Important**: Never use the `service_role` key in client-side code! Always use the `anon` key.

---

## Environment File Configuration

The app uses different environment files for different contexts:

### Development (Web)

**File**: `.env` or `.env.local`

```env
VITE_SUPABASE_URL="https://xoqtpirlztyemmiuktij.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXRwaXJsenR5ZW1taXVrdGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDcyNjUsImV4cCI6MjA3OTI4MzI2NX0.yUadckdBXgVE4jE8jLtQGM5k4fT4oZwU32sEh9XiVgQ"
```

**Used by**: `npm run dev`

### Production / Mobile Builds

**File**: `.env.production`

```env
VITE_SUPABASE_URL="https://xoqtpirlztyemmiuktij.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXRwaXJsenR5ZW1taXVrdGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDcyNjUsImV4cCI6MjA3OTI4MzI2NX0.yUadckdBXgVE4jE8jLtQGM5k4fT4oZwU32sEh9XiVgQ"
```

**Used by**:
- `npm run build`
- `npm run mobile:ios`
- `npm run mobile:android`
- All mobile build scripts

---

## Initial Setup

### Step 1: Create Environment Files

Create two files in your project root:

```bash
# Create .env for development
touch .env

# Create .env.production for production/mobile builds
touch .env.production
```

### Step 2: Add Your Credentials

Edit both files and add your Supabase credentials:

**.env** (development):
```env
VITE_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
```

**.env.production** (production/mobile):
```env
VITE_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
```

**Important**: Use the exact same values in both files unless you have separate development and production Supabase projects.

### Step 3: Verify Configuration

After adding the environment variables, test that they work:

```bash
# Test in development mode
npm run dev
```

Open your browser to `http://localhost:8080`. The app should load without any "Missing Supabase environment variables" errors.

---

## Commands Reference

### Web Development

```bash
# Start development server (uses .env)
npm run dev

# Build for production (uses .env.production)
npm run build

# Preview production build locally
npm run preview
```

### Mobile Development

#### iOS

```bash
# Build and open in Xcode (uses .env.production)
npm run mobile:ios

# Build, sync, and run on iOS device/simulator (uses .env.production)
npm run mobile:run:ios

# Manual process:
# 1. Build first
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

#### Android

```bash
# Build and open in Android Studio (uses .env.production)
npm run mobile:android

# Build, sync, and run on Android device/emulator (uses .env.production)
npm run mobile:run:android

# Manual process:
# 1. Build first
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Symptoms**:
- Blank white screen in mobile app
- Console error: "Missing Supabase environment variables"
- Configuration error screen showing

**Causes**:
1. Environment variables not set
2. Typo in variable names (must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
3. Missing quotes around values in .env file
4. Wrong .env file being used (development vs production)

**Solutions**:

1. **Verify .env files exist**:
   ```bash
   ls -la .env*
   ```
   You should see `.env` and `.env.production`

2. **Check variable names**:
   ```bash
   cat .env
   ```
   Make sure variables are named exactly:
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL` or `VITE_SUPABASE_PROJECT_URL`)
   - `VITE_SUPABASE_ANON_KEY` (not `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_KEY`)

3. **Check for proper quoting**:
   ```env
   # ✅ CORRECT
   VITE_SUPABASE_URL="https://example.supabase.co"

   # ❌ WRONG (no quotes)
   VITE_SUPABASE_URL=https://example.supabase.co

   # ❌ WRONG (single quotes)
   VITE_SUPABASE_URL='https://example.supabase.co'
   ```

4. **Verify values are correct**:
   - URL should start with `https://` and end with `.supabase.co`
   - Anon key should be a long JWT string starting with `eyJ`

5. **Rebuild after changes**:
   ```bash
   # For web
   npm run build

   # For mobile (rebuilds and syncs)
   npm run mobile:sync
   ```

6. **Clear cache and rebuild**:
   ```bash
   # Remove build artifacts
   rm -rf dist node_modules/.vite

   # Rebuild
   npm run build

   # For mobile
   npm run mobile:sync
   ```

### Environment Variables Not Working in Capacitor

**Problem**: App works in browser (`npm run dev`) but fails in mobile app with "Missing Supabase environment variables"

**Cause**: Mobile apps use the production build, which requires `.env.production` to be configured.

**Solution**:

1. Ensure `.env.production` exists and has the correct values
2. Rebuild with production mode:
   ```bash
   npm run mobile:sync
   ```
3. Clean previous builds:
   ```bash
   # For iOS
   rm -rf ios/App/App/public

   # For Android
   rm -rf android/app/src/main/assets/public

   # Rebuild
   npm run mobile:sync
   ```

### Different Credentials for Development vs Production

If you want to use different Supabase projects for development and production:

**.env** (development project):
```env
VITE_SUPABASE_URL="https://dev-project.supabase.co"
VITE_SUPABASE_ANON_KEY="dev_anon_key_here"
```

**.env.production** (production project):
```env
VITE_SUPABASE_URL="https://prod-project.supabase.co"
VITE_SUPABASE_ANON_KEY="prod_anon_key_here"
```

### Configuration Error Screen in Development

If you see the configuration error screen during development:

1. Check that `.env` file exists in project root
2. Verify both variables are set
3. Restart the dev server:
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

---

## Security Best Practices

### ✅ DO:
- Use the `anon` key (public key) in your `.env` files
- Commit `.env.production` to version control (it only contains public keys)
- Keep your `service_role` key in a secure location (backend only)
- Use Row Level Security (RLS) policies in Supabase to protect data

### ❌ DON'T:
- Never use the `service_role` key in client-side code
- Don't commit `.env.local` to version control
- Don't hardcode credentials directly in source code
- Don't share your `service_role` key publicly

---

## How It Works

### Build-Time Injection

Vite replaces `import.meta.env.VITE_*` variables at **build time**:

1. During development (`npm run dev`):
   - Vite reads `.env` and `.env.local`
   - Variables are available immediately in the browser

2. During production build (`npm run build`):
   - Vite reads `.env.production`
   - Variables are baked into the compiled JavaScript files
   - The compiled `dist/` folder contains the values

3. In Capacitor mobile apps:
   - The `dist/` folder is copied to iOS/Android projects
   - Environment variables are already embedded in the JavaScript
   - No runtime `.env` file is needed on the device

### Validation

The app validates Supabase configuration at startup:

- **Development**: Throws a clear error if variables are missing
- **Production**: Shows user-friendly error screen instead of blank page

**File**: `src/integrations/supabase/client.ts`

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (import.meta.env.DEV) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  } else {
    console.error('Supabase configuration error');
  }
}
```

---

## Quick Reference

### Minimum Required Files

```
project/
├── .env                    # Development config
├── .env.production         # Production/mobile config
└── src/
    └── integrations/
        └── supabase/
            └── client.ts   # Supabase client initialization
```

### Environment Variable Checklist

- [ ] `.env` file exists in project root
- [ ] `.env.production` file exists in project root
- [ ] Both files contain `VITE_SUPABASE_URL`
- [ ] Both files contain `VITE_SUPABASE_ANON_KEY`
- [ ] Values are wrapped in double quotes
- [ ] URL starts with `https://` and ends with `.supabase.co`
- [ ] Anon key is a valid JWT token
- [ ] Variables use exactly these names (no typos)

### Test Commands

```bash
# 1. Test development mode
npm run dev
# ✅ App should load at http://localhost:8080

# 2. Test production build
npm run build
# ✅ Should complete without errors

# 3. Test mobile sync
npm run mobile:sync
# ✅ Should build and sync to iOS/Android

# 4. Test iOS app
npm run mobile:run:ios
# ✅ App should launch on device/simulator without blank screen

# 5. Test Android app
npm run mobile:run:android
# ✅ App should launch on device/emulator without blank screen
```

---

## Need Help?

If you're still experiencing issues:

1. Check the main [troubleshooting guide](./troubleshooting.md)
2. Verify your Supabase project is active in the [Supabase Dashboard](https://supabase.com/dashboard)
3. Check browser console for detailed error messages
4. For mobile apps, check:
   - iOS: Xcode console
   - Android: Logcat in Android Studio

---

## Summary

**For Web Development**:
1. Create `.env` with your Supabase credentials
2. Run `npm run dev`

**For Mobile Development**:
1. Create `.env.production` with your Supabase credentials
2. Run `npm run mobile:ios` or `npm run mobile:android`

**Remember**:
- Always use `VITE_` prefix
- Use double quotes around values
- Rebuild after changing .env files
- Mobile apps use `.env.production`, not `.env`
