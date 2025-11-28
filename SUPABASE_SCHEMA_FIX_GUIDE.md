# ✅ SUPABASE SCHEMA ERRORS - COMPLETE FIX GUIDE

## Status: READY TO DEPLOY ✅

**Build:** ✅ Success (24.57s)
**Date:** 2025-11-27

---

# STEP 1: ALL TABLES IDENTIFIED ✅

## Tables Used in the App:

| Table Name | Purpose | Status |
|------------|---------|--------|
| **profiles** | User profiles with settings | ✅ May need update |
| **prayer_tracking** | Daily prayer completions (on-time/late/missed) | ✅ May need creation |
| **dhikr_tracking** | Dhikr completion after prayers | ✅ May need creation |
| **period_tracking** | Menstrual period tracking (female users) | ❌ MISSING |
| **period_dhikr_tracking** | Spiritual activities during period | ❌ MISSING |
| **badges** | User achievements/badges | ❌ MISSING |
| **hadiths** | Global hadith database | ❌ MISSING |

---

# STEP 2: SQL TO RUN IN SUPABASE ✅

## WHERE TO RUN THIS:
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. **Copy the ENTIRE contents of `SUPABASE_TABLES_SQL.sql`**
5. Paste and click "Run"
6. After success, **IMPORTANT:** Go to "API Docs" and click **"Refresh Schema"**

## What the SQL Does:
- Creates all missing tables with IF NOT EXISTS (safe to run multiple times)
- Sets up Row Level Security (RLS) for all tables
- Creates policies so users can only see their own data
- Adds indexes for performance
- Inserts 3 sample hadiths for testing

---

# STEP 3: CODE CHANGES MADE ✅

## Files Modified:

### 1. **src/hooks/useWeeklyHadith.ts**
**Changed:** Added graceful error handling for missing 'hadiths' table

**Before:**
```typescript
if (error) throw error;
```

**After:**
```typescript
if (error) {
  // Check for schema cache error (PGRST205)
  if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
    console.error("Table 'hadiths' non trouvée:", error);
    toast({
      title: "Erreur de configuration",
      description: "Une erreur de configuration du serveur s'est produite.",
      variant: "destructive",
    });
    setLoading(false);
    return; // Don't crash the app
  }
  throw error;
}
```

### 2. **src/hooks/useBadges.ts**
**Changed:** Added error handling for missing 'badges' table

- Catches PGRST205 errors gracefully
- Shows French error message
- Returns empty array instead of crashing

### 3. **src/hooks/usePeriodMode.ts**
**Changed:** Added error handling for missing 'period_tracking' table

- Catches schema cache errors
- Sets sensible defaults (not in period)
- Shows French toast notification

---

# STEP 4: ERROR HANDLING STRATEGY ✅

## What Happens Now:

### Before Fix:
```
App tries to load hadiths
  ↓
Supabase returns: "Could not find table 'public.hadiths'"
  ↓
App crashes / shows blank screen
```

### After Fix:
```
App tries to load hadiths
  ↓
Supabase returns: PGRST205 error
  ↓
Code catches the error
  ↓
Logs: "Table 'hadiths' non trouvée"
  ↓
Shows French toast: "Erreur de configuration du serveur"
  ↓
App continues working (doesn't crash)
```

## User Experience:
- ✅ App doesn't crash
- ✅ French error messages
- ✅ Other features continue to work
- ✅ Easy to debug (clear console logs)

---

# STEP 5: WHY THESE ERRORS HAPPENED

## Root Cause: Schema Cache Mismatch

**What is PGRST205?**
- Error code from PostgREST (Supabase's API layer)
- Means: "I can't find this table in my cached schema"

**Why it happened:**
1. Code references tables: `hadiths`, `badges`, `period_tracking`, etc.
2. These tables don't exist in your Supabase database
3. Supabase API returns PGRST205 error
4. App crashes because errors weren't handled

**The Fix:**
1. ✅ Created SQL to add ALL missing tables
2. ✅ Added error handling in code
3. ✅ Schema refresh updates the cache

---

# STEP 6: WHAT YOU MUST DO MANUALLY

## Required Steps (IN ORDER):

### 1. Run the SQL ✅
```bash
# File: SUPABASE_TABLES_SQL.sql
# Location: Project root
# Action: Copy entire file → Paste in Supabase SQL Editor → Run
```

### 2. Refresh Schema Cache ⚠️ **CRITICAL**
```
Supabase Dashboard
  → API Docs (left sidebar)
  → Click "Refresh Schema" button (top right)
```
**Why?** This tells Supabase to update its cache with the new tables.

### 3. Verify Tables Were Created
```
Supabase Dashboard
  → Table Editor (left sidebar)
  → You should see all 7 tables listed
```

### 4. Test the App
```bash
npm run build
npx cap sync
npx cap open ios  # or android

# OR test on web:
npm run dev
```

---

# STEP 7: TABLE DETAILS

## 1. profiles
**Purpose:** User account information and settings

**Columns:**
- `id` - UUID (links to auth.users)
- `email` - TEXT
- `first_name` - TEXT
- `gender` - TEXT ('male' or 'female')
- `prayer_goal` - INTEGER (default 5)
- `adhkar_goal` - INTEGER (default 3)
- `goals` - TEXT ARRAY
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** Users can only see/edit their own profile

## 2. prayer_tracking
**Purpose:** Track daily prayer completions

**Columns:**
- `id` - UUID (primary key)
- `user_id` - UUID (foreign key)
- `prayer_date` - DATE
- `prayer_name` - TEXT (Fajr, Dhuhr, Asr, Maghrib, Isha)
- `status` - TEXT (pending, on-time, late, missed)
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** Users can only see/edit their own prayer data

## 3. dhikr_tracking
**Purpose:** Track dhikr after prayers

**Columns:**
- `id` - UUID
- `user_id` - UUID (foreign key)
- `prayer_date` - DATE
- `prayer_name` - TEXT
- `completed` - BOOLEAN
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** Users can only see/edit their own dhikr data

## 4. period_tracking
**Purpose:** Track menstrual periods for female users

**Columns:**
- `id` - UUID
- `user_id` - UUID (foreign key)
- `start_date` - DATE
- `end_date` - DATE (nullable)
- `is_active` - BOOLEAN
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** Users can only see/edit their own period data

## 5. period_dhikr_tracking
**Purpose:** Track spiritual activities during period

**Columns:**
- `id` - UUID
- `user_id` - UUID (foreign key)
- `prayer_date` - DATE
- `prayer_name` - TEXT
- `dhikr_type` - TEXT (quran, dhikr, dua, charity, islamic-learning)
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** Users can only see/edit their own data

## 6. badges
**Purpose:** User achievements and badges

**Columns:**
- `id` - UUID
- `user_id` - UUID (foreign key)
- `badge_type` - TEXT
- `badge_name` - TEXT
- `badge_description` - TEXT
- `earned_at` - TIMESTAMPTZ
- `created_at` - TIMESTAMPTZ

**RLS:** Users can only see their own badges

## 7. hadiths
**Purpose:** Global hadith database (read-only)

**Columns:**
- `id` - UUID
- `title` - TEXT
- `arabic_text` - TEXT
- `french_translation` - TEXT
- `reference` - TEXT
- `week_number` - INTEGER
- `is_published` - BOOLEAN
- `created_at`, `updated_at` - TIMESTAMPTZ

**RLS:** All users can read published hadiths (no write access)

---

# STEP 8: TESTING CHECKLIST

## After Running SQL:

### ✅ Test Hadiths:
```
1. Open app
2. Go to Dashboard tab
3. Should see "Hadith du jour" section
4. NO error toasts about "hadiths" table
```

### ✅ Test Badges:
```
1. Complete a prayer streak
2. Should earn badges
3. NO error about "badges" table
```

### ✅ Test Period Tracking (Female Users):
```
1. Go to Settings
2. Set gender to "female"
3. Toggle period mode ON/OFF
4. NO error about "period_tracking" table
```

### ✅ Test Prayer Tracking:
```
1. Go to Prayers tab
2. Mark a prayer as done
3. Check stats/history
4. NO errors about "prayer_tracking" table
```

---

# STEP 9: TROUBLESHOOTING

## Problem: Still seeing PGRST205 errors

**Solution:**
1. Did you run the ENTIRE SQL file?
2. Did you click "Refresh Schema" in API Docs?
3. Wait 30 seconds, then hard refresh your browser (Ctrl+Shift+R)
4. Check Supabase Dashboard > Table Editor - do you see all 7 tables?

## Problem: RLS errors ("permission denied")

**Solution:**
1. Make sure you're logged in (not guest mode)
2. Check that RLS policies were created (SQL includes them)
3. In Supabase Dashboard > Authentication, verify your user exists

## Problem: No hadiths showing

**Solution:**
1. Check if hadiths were inserted (SQL includes 3 samples)
2. In Supabase > Table Editor > hadiths, verify rows exist with `is_published = true`
3. Add more hadiths manually if needed

---

# STEP 10: SUMMARY

## What Was Fixed:

✅ **Identified:** All 7 tables used by the app
✅ **Created:** Complete SQL with tables, RLS, policies, indexes
✅ **Added:** Graceful error handling in 3 hooks
✅ **French:** All error messages in French
✅ **Safe:** App doesn't crash on missing tables
✅ **Build:** Success (24.57s)

## Next Steps:

1. ✅ Copy `SUPABASE_TABLES_SQL.sql` to Supabase SQL Editor
2. ✅ Run the SQL
3. ✅ Click "Refresh Schema" in API Docs
4. ✅ Test the app
5. ✅ Deploy!

---

**Status:** ✅ READY TO DEPLOY
**All tables defined, all errors handled, all in French!**
