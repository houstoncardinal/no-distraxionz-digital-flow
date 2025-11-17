-- World-class E-commerce Enhancements Migration
-- 1. Wishlist persistence to database
-- 2. Loyalty points system
-- 3. Enhanced order details
-- 4. Email notification tracking

-- Create wishlist table for database persistence
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS policies for wishlists
CREATE POLICY "Users can view own wishlist"
ON public.wishlists
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
ON public.wishlists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
ON public.wishlists
FOR DELETE
USING (auth.uid() = user_id);

-- Create loyalty points table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze', -- bronze, silver, gold, platinum
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

-- RLS policies for loyalty_points
CREATE POLICY "Users can view own loyalty points"
ON public.loyalty_points
FOR SELECT
USING (auth.uid() = user_id);

-- Create loyalty transactions table for tracking
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for loyalty_transactions
CREATE POLICY "Users can view own loyalty transactions"
ON public.loyalty_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Create email notifications log
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'order_confirmation', 'shipping_update', 'delivery', 'welcome'
  order_id UUID REFERENCES public.orders(id),
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_notifications (admin only view)
CREATE POLICY "Users can view own email notifications"
ON public.email_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Function to award loyalty points on order
CREATE OR REPLACE FUNCTION public.award_loyalty_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  points_to_award INTEGER;
  current_points INTEGER;
  new_tier TEXT;
BEGIN
  -- Award 1 point per dollar spent
  points_to_award := FLOOR(NEW.total_amount);

  -- Upsert loyalty points
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points)
  VALUES (NEW.user_id, points_to_award, points_to_award)
  ON CONFLICT (user_id)
  DO UPDATE SET
    points = loyalty_points.points + points_to_award,
    lifetime_points = loyalty_points.lifetime_points + points_to_award,
    updated_at = now();

  -- Get updated lifetime points
  SELECT lifetime_points INTO current_points
  FROM public.loyalty_points
  WHERE user_id = NEW.user_id;

  -- Determine tier based on lifetime points
  IF current_points >= 10000 THEN
    new_tier := 'platinum';
  ELSIF current_points >= 5000 THEN
    new_tier := 'gold';
  ELSIF current_points >= 2000 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;

  -- Update tier
  UPDATE public.loyalty_points
  SET tier = new_tier
  WHERE user_id = NEW.user_id;

  -- Log transaction
  INSERT INTO public.loyalty_transactions (user_id, points, transaction_type, description, order_id)
  VALUES (NEW.user_id, points_to_award, 'earned', 'Points earned from order', NEW.id);

  RETURN NEW;
END;
$$;

-- Trigger to award points when order is created (status = 'processing' or 'delivered')
CREATE TRIGGER award_points_on_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL AND NEW.status IN ('processing', 'delivered'))
  EXECUTE FUNCTION public.award_loyalty_points();

-- Function to create welcome email notification
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create welcome email notification
  INSERT INTO public.email_notifications (user_id, email, notification_type, metadata)
  VALUES (
    NEW.id,
    NEW.email,
    'welcome',
    jsonb_build_object('full_name', NEW.full_name)
  );

  RETURN NEW;
END;
$$;

-- Trigger for welcome email on profile creation
CREATE TRIGGER send_welcome_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email();

-- Function to create order confirmation email
CREATE OR REPLACE FUNCTION public.send_order_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create order confirmation email notification
  INSERT INTO public.email_notifications (user_id, email, notification_type, order_id, metadata)
  VALUES (
    NEW.user_id,
    NEW.customer_email,
    'order_confirmation',
    NEW.id,
    jsonb_build_object(
      'order_number', NEW.id,
      'total_amount', NEW.total_amount,
      'customer_name', NEW.customer_name
    )
  );

  RETURN NEW;
END;
$$;

-- Trigger for order confirmation email
CREATE TRIGGER send_confirmation_on_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.send_order_confirmation();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON public.email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent ON public.email_notifications(sent) WHERE sent = false;

-- Update handle_new_user to initialize loyalty points
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  -- Assign admin role to cardinal.hunain@gmail.com, customer to everyone else
  IF NEW.email = 'cardinal.hunain@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
  END IF;

  -- Initialize loyalty points
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points, tier)
  VALUES (NEW.id, 0, 0, 'bronze');

  RETURN NEW;
END;
$$;
