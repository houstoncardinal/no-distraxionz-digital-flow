-- Add featured column to products table (missing from schema but used in code)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create index for faster featured product queries
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;