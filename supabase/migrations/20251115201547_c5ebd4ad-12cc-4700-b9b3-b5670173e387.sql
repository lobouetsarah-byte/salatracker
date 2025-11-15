-- Add gender field to profiles table
ALTER TABLE public.profiles
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));

-- Create period_tracking table
CREATE TABLE public.period_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for period_tracking
ALTER TABLE public.period_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for period_tracking
CREATE POLICY "Users can view their own period tracking"
ON public.period_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own period tracking"
ON public.period_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own period tracking"
ON public.period_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own period tracking"
ON public.period_tracking FOR DELETE
USING (auth.uid() = user_id);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER NOT NULL DEFAULT 1,
  current_count INTEGER NOT NULL DEFAULT 0,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('prayer', 'dhikr', 'quran', 'custom')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS policies for goals
CREATE POLICY "Users can view their own goals"
ON public.goals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
ON public.goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
ON public.goals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
ON public.goals FOR DELETE
USING (auth.uid() = user_id);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for badges
CREATE POLICY "Users can view their own badges"
ON public.badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
ON public.badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own badges"
ON public.badges FOR DELETE
USING (auth.uid() = user_id);

-- Create hadiths table (public, no RLS needed)
CREATE TABLE public.hadiths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  french_translation TEXT NOT NULL,
  reference TEXT NOT NULL,
  week_number INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger for updated_at on period_tracking
CREATE TRIGGER update_period_tracking_updated_at
BEFORE UPDATE ON public.period_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on goals
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on hadiths
CREATE TRIGGER update_hadiths_updated_at
BEFORE UPDATE ON public.hadiths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();