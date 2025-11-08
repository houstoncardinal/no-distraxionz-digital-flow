-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view discount codes" ON public.discount_codes;
DROP POLICY IF EXISTS "Anyone can manage discount codes" ON public.discount_codes;
DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can manage collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can view collection products" ON public.collection_products;
DROP POLICY IF EXISTS "Anyone can manage collection products" ON public.collection_products;

-- Create fresh policies
CREATE POLICY "Anyone can view discount codes" ON public.discount_codes FOR SELECT USING (true);
CREATE POLICY "Anyone can manage discount codes" ON public.discount_codes FOR ALL USING (true);

CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Anyone can manage collections" ON public.collections FOR ALL USING (true);

CREATE POLICY "Anyone can view collection products" ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "Anyone can manage collection products" ON public.collection_products FOR ALL USING (true);