# Quick Start Guide

## 🎬 App Startup & Loading Behavior

### What You'll See on App Launch

**✅ Normal Startup (1-3 seconds)**:
1. Splash screen appears with Salatracker logo and loading animation
2. App initializes Supabase authentication in background
3. Splash smoothly fades out
4. Main app interface appears

**❌ Configuration Error**:
- Red error card with "Supabase configuration error" message
- Instructions to check `.env` file
- **Never** shows a blank or green screen

**⚠️ Network/Timeout Error**:
- Splash screen stays visible with loading indicator
- After 30 seconds: "Loading too long" error message appears
- "Reload application" button to retry
- Clear explanation of the issue

### Mobile-Specific Behavior

**Safe Areas & Layout**:
- Content respects iOS notch, status bar, and home indicator
- Full-screen layout without overlapping system UI
- Bottom navigation positioned above home indicator
- Works on all iPhone/Android screen sizes

**Error Recovery**:
- JavaScript errors show user-friendly error screen (not blank)
- Technical details available in collapsible section
- "Reload application" button always available
- Error boundary catches and displays all runtime errors

---

## 🔧 Supabase Environment Setup

This is a **quick reference** for setting up your Supabase environment variables. For detailed information, see [supabase-env-setup.md](./supabase-env-setup.md).

---

## 🚀 Setup in 3 Steps

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 2: Create Environment Files

Create two files in your project root:

**`.env`** (for development):
```env
VITE_SUPABASE_URL="YOUR_PROJECT_URL_HERE"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
```

**`.env.production`** (for mobile/production):
```env
VITE_SUPABASE_URL="YOUR_PROJECT_URL_HERE"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"
```

⚠️ **Important**:
- Use **double quotes** around values
- Use the exact variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Use the same values in both files (unless you have separate dev/prod projects)

### Step 3: Test It Works

```bash
# Test web development
npm run dev
# Open http://localhost:8080 - should load without errors

# Test mobile build
npm run mobile:sync
# Should complete without errors
```

---

## 📱 Running the App

### Web (Development)
```bash
npm run dev
```
Opens at `http://localhost:8080`

### iOS
```bash
npm run mobile:ios
```
Builds app and opens Xcode. Click ▶️ to run.

### Android
```bash
npm run mobile:android
```
Builds app and opens Android Studio. Click ▶️ to run.

---

## ❌ Troubleshooting

### "Missing Supabase environment variables" error?

1. **Check files exist**:
   ```bash
   ls -la .env*
   ```
   You should see `.env` and `.env.production`

2. **Check variable names are correct**:
   ```bash
   cat .env
   ```
   Must be exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Rebuild**:
   ```bash
   npm run build
   npm run mobile:sync
   ```

### Still not working?

See the [Supabase Environment Setup Guide](./supabase-env-setup.md) for detailed troubleshooting.

---

## ✅ What You Should See

### When Configured Correctly
- ✅ Splash screen appears immediately on launch
- ✅ Brief loading (1-3 seconds)
- ✅ App loads smoothly without blank screens
- ✅ No error messages in console
- ✅ Can sign up / log in
- ✅ Prayer times and location load correctly

### When Configured Incorrectly
- ❌ Shows "Configuration Error" screen (red card, clear message)
- ❌ **Never** a blank or green screen
- ❌ Error message clearly states what's wrong
- ❌ Provides instructions on how to fix
- ❌ Cannot use the app until fixed

### If Network Issue
- ⚠️ Splash screen shows for longer
- ⚠️ After 30s: "Loading too long" error appears
- ⚠️ Reload button available
- ⚠️ Check your internet connection

---

## 📚 More Information

- [Full Setup Guide](./supabase-env-setup.md) - Detailed instructions
- [Fix Summary](./SUPABASE_ENV_FIX_SUMMARY.md) - What was changed
- [Troubleshooting](./troubleshooting.md) - Common issues

---

## 🔑 Example

Here's what your `.env` files should look like (with real values):

```env
VITE_SUPABASE_URL="https://xoqtpirlztyemmiuktij.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcXRwaXJsenR5ZW1taXVrdGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDcyNjUsImV4cCI6MjA3OTI4MzI2NX0.yUadckdBXgVE4jE8jLtQGM5k4fT4oZwU32sEh9XiVgQ"
```

That's it! 🎉
