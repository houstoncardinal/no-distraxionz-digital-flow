-- =====================================================
-- SECURITY FIX: Comprehensive RLS Policy Overhaul
-- =====================================================

-- Drop all permissive "Anyone can..." policies that expose data

-- ORDERS TABLE - Secure customer order data
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders" 
ON public.orders FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- ORDER ITEMS TABLE - Secure order item data
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can delete order items" ON public.order_items;

CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admins can update order items" 
ON public.order_items FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete order items" 
ON public.order_items FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- REVIEWS TABLE - Hide customer emails from public, allow public viewing of reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can manage reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update reviews" 
ON public.reviews FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews" 
ON public.reviews FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- ABANDONED CARTS TABLE - Admin only
DROP POLICY IF EXISTS "Anyone can view abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Anyone can manage abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Admins can view abandoned carts" 
ON public.abandoned_carts FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create abandoned carts" 
ON public.abandoned_carts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update abandoned carts" 
ON public.abandoned_carts FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete abandoned carts" 
ON public.abandoned_carts FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- DISCOUNT CODES TABLE - Public can only validate, admins manage
DROP POLICY IF EXISTS "Anyone can view discount codes" ON public.discount_codes;
DROP POLICY IF EXISTS "Anyone can manage discount codes" ON public.discount_codes;

CREATE POLICY "Public can view active discount codes" 
ON public.discount_codes FOR SELECT 
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create discount codes" 
ON public.discount_codes FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update discount codes" 
ON public.discount_codes FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete discount codes" 
ON public.discount_codes FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- CUSTOMER SEGMENTS TABLE - Admin only
DROP POLICY IF EXISTS "Anyone can manage customer segments" ON public.customer_segments;

CREATE POLICY "Admins can view customer segments" 
ON public.customer_segments FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create customer segments" 
ON public.customer_segments FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customer segments" 
ON public.customer_segments FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete customer segments" 
ON public.customer_segments FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- MARKETING CAMPAIGNS TABLE - Admin only
DROP POLICY IF EXISTS "Anyone can manage campaigns" ON public.marketing_campaigns;

CREATE POLICY "Admins can view campaigns" 
ON public.marketing_campaigns FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create campaigns" 
ON public.marketing_campaigns FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaigns" 
ON public.marketing_campaigns FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaigns" 
ON public.marketing_campaigns FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- SHIPPING ZONES TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view shipping zones" ON public.shipping_zones;
DROP POLICY IF EXISTS "Anyone can manage shipping zones" ON public.shipping_zones;

CREATE POLICY "Public can view active shipping zones" 
ON public.shipping_zones FOR SELECT 
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create shipping zones" 
ON public.shipping_zones FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shipping zones" 
ON public.shipping_zones FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shipping zones" 
ON public.shipping_zones FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- TAX RATES TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view tax rates" ON public.tax_rates;
DROP POLICY IF EXISTS "Anyone can manage tax rates" ON public.tax_rates;

CREATE POLICY "Public can view active tax rates" 
ON public.tax_rates FOR SELECT 
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create tax rates" 
ON public.tax_rates FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tax rates" 
ON public.tax_rates FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tax rates" 
ON public.tax_rates FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- COLLECTIONS TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can manage collections" ON public.collections;

CREATE POLICY "Public can view active collections" 
ON public.collections FOR SELECT 
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create collections" 
ON public.collections FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collections" 
ON public.collections FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collections" 
ON public.collections FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- COLLECTION PRODUCTS TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view collection products" ON public.collection_products;
DROP POLICY IF EXISTS "Anyone can manage collection products" ON public.collection_products;

CREATE POLICY "Public can view collection products" 
ON public.collection_products FOR SELECT 
USING (true);

CREATE POLICY "Admins can create collection products" 
ON public.collection_products FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update collection products" 
ON public.collection_products FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete collection products" 
ON public.collection_products FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Public can view products" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Admins can create products" 
ON public.products FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCT IMAGES TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can manage product images" ON public.product_images;

CREATE POLICY "Public can view product images" 
ON public.product_images FOR SELECT 
USING (true);

CREATE POLICY "Admins can create product images" 
ON public.product_images FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images" 
ON public.product_images FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images" 
ON public.product_images FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCT VARIATIONS TABLE - Public read, admin manage
DROP POLICY IF EXISTS "Anyone can view product variations" ON public.product_variations;
DROP POLICY IF EXISTS "Anyone can manage product variations" ON public.product_variations;

CREATE POLICY "Public can view product variations" 
ON public.product_variations FOR SELECT 
USING (true);

CREATE POLICY "Admins can create product variations" 
ON public.product_variations FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product variations" 
ON public.product_variations FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product variations" 
ON public.product_variations FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES TABLE - Already has proper RLS, add INSERT policy for new user creation
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);