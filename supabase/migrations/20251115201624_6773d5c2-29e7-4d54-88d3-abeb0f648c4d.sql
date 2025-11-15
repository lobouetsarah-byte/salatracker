-- Enable RLS for hadiths table
ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read hadiths
CREATE POLICY "Anyone can view published hadiths"
ON public.hadiths FOR SELECT
USING (is_published = true);