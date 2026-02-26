
-- Create anniversary_photos table
CREATE TABLE public.anniversary_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'sexta',
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anniversary_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view photos" ON public.anniversary_photos
  FOR SELECT USING (true);

-- Admin insert/update/delete
CREATE POLICY "Admins can manage photos" ON public.anniversary_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('anniversary-photos', 'anniversary-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view anniversary photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'anniversary-photos');

CREATE POLICY "Admins can upload anniversary photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'anniversary-photos' AND
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete anniversary photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'anniversary-photos' AND
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
