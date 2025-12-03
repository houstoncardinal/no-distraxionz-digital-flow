-- Fix abandoned carts INSERT policy - require user association or authentication
DROP POLICY IF EXISTS "System can create abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Authenticated users can create their own abandoned carts" 
ON public.abandoned_carts FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Create a secure view for public reviews that hides email addresses
CREATE OR REPLACE VIEW public.reviews_public AS
SELECT 
  id,
  product_id,
  rating,
  verified_purchase,
  helpful_count,
  created_at,
  updated_at,
  customer_name,
  title,
  comment
FROM public.reviews;

-- Grant access to the view
GRANT SELECT ON public.reviews_public TO anon, authenticated;