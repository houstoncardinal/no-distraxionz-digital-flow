-- Add admin response / like tracking columns to reviews
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS admin_response TEXT,
  ADD COLUMN IF NOT EXISTS admin_likes INTEGER DEFAULT 0;
