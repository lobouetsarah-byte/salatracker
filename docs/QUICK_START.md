# Quick Start Guide - Supabase Environment Setup

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
- ✅ App loads without blank screens
- ✅ No error messages
- ✅ Can sign up / log in

### When Configured Incorrectly
- ❌ Shows "Configuration Error" screen (not blank)
- ❌ Clear error message in console
- ❌ Cannot use the app

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
