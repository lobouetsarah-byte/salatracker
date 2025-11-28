/*
  # Create Adhkar Logs Table

  1. New Tables
    - `adhkar_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `adhkar_date` (date) - the date when adhkar was completed
      - `dhikr_id` (text) - identifier for the specific dhikr (e.g., 'morning-invocation', 'ayat-kursi')
      - `dhikr_category` (text) - either 'morning' or 'evening'
      - `completed` (boolean) - whether the dhikr was completed
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Unique constraint on (user_id, adhkar_date, dhikr_id)

  2. Security
    - Enable RLS on `adhkar_logs` table
    - Add policies for authenticated users to manage their own adhkar logs
    - SELECT: Users can view their own adhkar logs
    - INSERT: Users can insert their own adhkar logs
    - UPDATE: Users can update their own adhkar logs
    - DELETE: Users can delete their own adhkar logs

  3. Important Notes
    - Data per account: Each user can only access their own adhkar logs via RLS
    - Data per date: adhkar_date field tracks when adhkar was completed
    - Supports both morning and evening adhkar categories
*/

-- Create adhkar_logs table
CREATE TABLE IF NOT EXISTS public.adhkar_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adhkar_date DATE NOT NULL,
  dhikr_id TEXT NOT NULL,
  dhikr_category TEXT NOT NULL CHECK (dhikr_category IN ('morning', 'evening')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, adhkar_date, dhikr_id)
);

-- Enable Row Level Security
ALTER TABLE public.adhkar_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own adhkar logs"
  ON public.adhkar_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adhkar logs"
  ON public.adhkar_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own adhkar logs"
  ON public.adhkar_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own adhkar logs"
  ON public.adhkar_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_adhkar_logs_updated_at
  BEFORE UPDATE ON public.adhkar_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
