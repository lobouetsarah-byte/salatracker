# Supabase Profiles Table Setup

## Overview

This document provides the SQL commands needed to create the `profiles` table in your Supabase database. This table stores user profile information including name, gender, and personal goals.

## Prerequisites

- Access to your Supabase project dashboard
- SQL Editor access in Supabase

## Instructions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a **New Query**
4. Copy and paste the SQL below
5. Click **Run** to execute

---

## SQL Schema

```sql
-- =====================================================
-- PROFILES TABLE FOR SALATRACKER
-- =====================================================
-- This migration creates the profiles table with user data
-- and sets up appropriate Row Level Security policies

-- Drop table if exists (CAUTION: Only use this in development)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  email TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', NULL)),
  prayer_goal INTEGER DEFAULT 5,
  adhkar_goal INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Optional: Create a function to automatically create a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Table Structure

### Columns

| Column       | Type         | Description                                  | Default |
|--------------|--------------|----------------------------------------------|---------|
| id           | UUID         | Primary key (auto-generated)                 | gen_random_uuid() |
| user_id      | UUID         | Foreign key to auth.users (unique)           | - |
| first_name   | TEXT         | User's first name                            | NULL |
| email        | TEXT         | User's email (synced from auth)              | NULL |
| gender       | TEXT         | User's gender (male/female/other)            | NULL |
| prayer_goal  | INTEGER      | Daily prayer completion goal                 | 5 |
| adhkar_goal  | INTEGER      | Daily adhkar completion goal                 | 3 |
| created_at   | TIMESTAMPTZ  | When profile was created                     | NOW() |
| updated_at   | TIMESTAMPTZ  | When profile was last updated                | NOW() |

### Constraints

- `user_id` must be unique (one profile per user)
- `user_id` references `auth.users(id)` with CASCADE DELETE
- `gender` must be 'male', 'female', 'other', or NULL

---

## Row Level Security (RLS)

The following policies are enforced:

1. **SELECT**: Users can only view their own profile
   - Checks: `auth.uid() = user_id`

2. **INSERT**: Users can only create their own profile
   - Checks: `auth.uid() = user_id`

3. **UPDATE**: Users can only update their own profile
   - Checks: `auth.uid() = user_id`

4. **DELETE**: Not allowed (profiles are deleted via CASCADE when auth user is deleted)

---

## Automatic Profile Creation

A database trigger (`on_auth_user_created`) automatically creates a profile entry when a new user signs up via Supabase Auth. This ensures every authenticated user has a corresponding profile.

---

## Testing the Setup

After running the SQL, test the setup:

### 1. Check Table Exists
```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'profiles';
```

### 2. Check RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';
```

### 3. Check Policies
```sql
SELECT * FROM pg_policies
WHERE tablename = 'profiles';
```

### 4. Test Profile Creation
Sign up a new user through your app, then check:
```sql
SELECT id, user_id, first_name, email, gender, created_at
FROM public.profiles;
```

---

## Troubleshooting

### Profile Not Created on Signup

If profiles aren't being created automatically:

1. Check if the trigger exists:
```sql
SELECT * FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

2. Manually create a profile:
```sql
INSERT INTO public.profiles (user_id, email, first_name)
VALUES (
  'YOUR_USER_ID_HERE',
  'user@example.com',
  'First Name'
);
```

### Permission Errors

If you get permission errors when querying:

1. Verify RLS is enabled
2. Check that policies allow the operation
3. Ensure you're authenticated with the correct user

### Update Issues

If updates don't work:

1. Check `updated_at` trigger is active
2. Verify UPDATE policy allows the operation
3. Check user_id matches auth.uid()

---

## Migration for Existing Users

If you already have users without profiles:

```sql
-- Create profiles for existing auth users
INSERT INTO public.profiles (user_id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;
```

---

## Next Steps

After running this SQL:

1. Test signup in your app
2. Verify profile creation
3. Test profile updates in Settings page
4. Check that RLS policies work correctly

---

**Status**: Ready for production
**Last Updated**: 2025-11-24
