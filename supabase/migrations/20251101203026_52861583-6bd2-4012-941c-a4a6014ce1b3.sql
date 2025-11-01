-- Add first_name and goals to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS goals TEXT[];

-- Update the handle_new_user function to include first_name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, goals)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    ARRAY[]::TEXT[]
  );
  RETURN new;
END;
$$;