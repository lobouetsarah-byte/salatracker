/*
  # Update Profiles Table - Add Missing Columns and Fix RLS

  1. Changes to `profiles` table
    - Add `prayer_goal` column (integer, default 5)
    - Add `adhkar_goal` column (integer, default 3)
    - The table already has: id, email, created_at, updated_at, first_name, goals, gender

  2. Security Updates
    - Drop existing policies (if any)
    - Create new RLS policies using `id` instead of `user_id`
    - Ensure RLS is enabled
    
  Note: The existing table uses `id` as the foreign key to auth.users(id)
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'prayer_goal'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN prayer_goal INTEGER DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'adhkar_goal'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN adhkar_goal INTEGER DEFAULT 3;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Create new policies using id (which is the foreign key to auth.users)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);
