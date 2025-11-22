-- Add enhanced fulfillment fields to orders table
ALTER TABLE public.orders ADD COLUMN tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN carrier TEXT;
ALTER TABLE public.orders ADD COLUMN notes TEXT;
ALTER TABLE public.orders ADD COLUMN fulfilled_by UUID REFERENCES auth.users(id);
ALTER TABLE public.orders ADD COLUMN fulfilled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.orders ADD COLUMN customer_notified BOOLEAN DEFAULT false;
ALTER TABLE public.orders ADD COLUMN last_email_sent TIMESTAMP WITH TIME ZONE;
