-- Add additional fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sizes JSONB,
ADD COLUMN IF NOT EXISTS colors JSONB,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Update existing products to have default values
UPDATE public.products 
SET 
  featured = false,
  sizes = '[]'::jsonb,
  colors = '[]'::jsonb,
  price_range = '$0-100'
WHERE featured IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
