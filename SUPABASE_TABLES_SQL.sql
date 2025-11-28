-- ============================================================================
-- SUPABASE TABLES SQL - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================================================
-- This file contains ALL table definitions for the Salatrack app.
-- Run this entire file in your Supabase SQL editor to create missing tables.
-- Tables that already exist will be skipped (IF NOT EXISTS).
-- ============================================================================

-- ============================================================================
-- TABLE 1: profiles
-- Purpose: User profiles with extended information
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  prayer_goal INTEGER DEFAULT 5,
  adhkar_goal INTEGER DEFAULT 3,
  goals TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TABLE 2: prayer_tracking
-- Purpose: Track daily prayer completions (on-time, late, missed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.prayer_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'on-time', 'late', 'missed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prayer_date, prayer_name)
);

ALTER TABLE public.prayer_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayer_tracking
DROP POLICY IF EXISTS "Users can view own prayers" ON public.prayer_tracking;
CREATE POLICY "Users can view own prayers"
  ON public.prayer_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own prayers" ON public.prayer_tracking;
CREATE POLICY "Users can insert own prayers"
  ON public.prayer_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own prayers" ON public.prayer_tracking;
CREATE POLICY "Users can update own prayers"
  ON public.prayer_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own prayers" ON public.prayer_tracking;
CREATE POLICY "Users can delete own prayers"
  ON public.prayer_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE 3: dhikr_tracking
-- Purpose: Track dhikr completions after prayers
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dhikr_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prayer_date, prayer_name)
);

ALTER TABLE public.dhikr_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dhikr_tracking
DROP POLICY IF EXISTS "Users can view own dhikr" ON public.dhikr_tracking;
CREATE POLICY "Users can view own dhikr"
  ON public.dhikr_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own dhikr" ON public.dhikr_tracking;
CREATE POLICY "Users can insert own dhikr"
  ON public.dhikr_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own dhikr" ON public.dhikr_tracking;
CREATE POLICY "Users can update own dhikr"
  ON public.dhikr_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own dhikr" ON public.dhikr_tracking;
CREATE POLICY "Users can delete own dhikr"
  ON public.dhikr_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE 4: period_tracking
-- Purpose: Track menstrual period dates for female users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.period_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.period_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for period_tracking
DROP POLICY IF EXISTS "Users can view own periods" ON public.period_tracking;
CREATE POLICY "Users can view own periods"
  ON public.period_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own periods" ON public.period_tracking;
CREATE POLICY "Users can insert own periods"
  ON public.period_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own periods" ON public.period_tracking;
CREATE POLICY "Users can update own periods"
  ON public.period_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own periods" ON public.period_tracking;
CREATE POLICY "Users can delete own periods"
  ON public.period_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE 5: period_dhikr_tracking
-- Purpose: Track spiritual activities during period (when prayers are not tracked)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.period_dhikr_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_date DATE NOT NULL,
  prayer_name TEXT NOT NULL CHECK (prayer_name IN ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha')),
  dhikr_type TEXT CHECK (dhikr_type IN ('quran', 'dhikr', 'dua', 'charity', 'islamic-learning')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prayer_date, prayer_name)
);

ALTER TABLE public.period_dhikr_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for period_dhikr_tracking
DROP POLICY IF EXISTS "Users can view own period dhikr" ON public.period_dhikr_tracking;
CREATE POLICY "Users can view own period dhikr"
  ON public.period_dhikr_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own period dhikr" ON public.period_dhikr_tracking;
CREATE POLICY "Users can insert own period dhikr"
  ON public.period_dhikr_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own period dhikr" ON public.period_dhikr_tracking;
CREATE POLICY "Users can update own period dhikr"
  ON public.period_dhikr_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own period dhikr" ON public.period_dhikr_tracking;
CREATE POLICY "Users can delete own period dhikr"
  ON public.period_dhikr_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE 6: badges
-- Purpose: Store earned badges/achievements for users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges
DROP POLICY IF EXISTS "Users can view own badges" ON public.badges;
CREATE POLICY "Users can view own badges"
  ON public.badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own badges" ON public.badges;
CREATE POLICY "Users can insert own badges"
  ON public.badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TABLE 7: hadiths
-- Purpose: Global hadith database (read-only for users, admin-managed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hadiths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  french_translation TEXT NOT NULL,
  reference TEXT NOT NULL,
  week_number INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hadiths (read-only for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view published hadiths" ON public.hadiths;
CREATE POLICY "Authenticated users can view published hadiths"
  ON public.hadiths FOR SELECT
  TO authenticated
  USING (is_published = TRUE);

-- Allow anonymous access too (for guest users)
DROP POLICY IF EXISTS "Anonymous users can view published hadiths" ON public.hadiths;
CREATE POLICY "Anonymous users can view published hadiths"
  ON public.hadiths FOR SELECT
  TO anon
  USING (is_published = TRUE);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- prayer_tracking indexes
CREATE INDEX IF NOT EXISTS idx_prayer_tracking_user_date 
  ON public.prayer_tracking(user_id, prayer_date DESC);

-- dhikr_tracking indexes
CREATE INDEX IF NOT EXISTS idx_dhikr_tracking_user_date 
  ON public.dhikr_tracking(user_id, prayer_date DESC);

-- period_tracking indexes
CREATE INDEX IF NOT EXISTS idx_period_tracking_user_active 
  ON public.period_tracking(user_id, is_active) 
  WHERE is_active = TRUE;

-- period_dhikr_tracking indexes
CREATE INDEX IF NOT EXISTS idx_period_dhikr_tracking_user_date 
  ON public.period_dhikr_tracking(user_id, prayer_date DESC);

-- badges indexes
CREATE INDEX IF NOT EXISTS idx_badges_user_earned 
  ON public.badges(user_id, earned_at DESC);

-- hadiths indexes
CREATE INDEX IF NOT EXISTS idx_hadiths_week_published 
  ON public.hadiths(week_number, is_published) 
  WHERE is_published = TRUE;

-- ============================================================================
-- SAMPLE DATA: Insert a few hadiths for testing
-- ============================================================================

INSERT INTO public.hadiths (title, arabic_text, french_translation, reference, week_number, is_published)
VALUES
  (
    'La sincérité dans les actes',
    'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    'Les actes ne valent que par leurs intentions, et chacun n''aura que ce qu''il a eu l''intention de faire.',
    'Sahih al-Bukhari 1',
    1,
    TRUE
  ),
  (
    'La prière est lumière',
    'الصَّلاَةُ نُورٌ',
    'La prière est une lumière.',
    'Sahih Muslim 223',
    2,
    TRUE
  ),
  (
    'Le meilleur des hommes',
    'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    'Le meilleur d''entre vous est celui qui apprend le Coran et l''enseigne.',
    'Sahih al-Bukhari 5027',
    3,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF SQL
-- ============================================================================
-- After running this, go to Supabase Dashboard > API Docs and click "Refresh Schema"
-- This will update the schema cache and eliminate PGRST205 errors.
-- ============================================================================
