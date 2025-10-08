-- Add missing fields to products table for No Distraxionz
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- Add comment for documentation
COMMENT ON COLUMN public.products.featured IS 'Whether this product is featured on the homepage';
COMMENT ON COLUMN public.products.sizes IS 'Available sizes as JSON array';
COMMENT ON COLUMN public.products.colors IS 'Available colors as JSON array';

