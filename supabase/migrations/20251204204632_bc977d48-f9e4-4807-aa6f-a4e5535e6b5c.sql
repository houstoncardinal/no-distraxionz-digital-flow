-- Drop and recreate view with SECURITY INVOKER to respect RLS
DROP VIEW IF EXISTS public.reviews_public;

CREATE VIEW public.reviews_public 
WITH (security_invoker = true)
AS
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