import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

// Get Stripe publishable key from Supabase edge function
let stripePromiseCache: Promise<any> | null = null;

export const getStripePromise = async () => {
  if (stripePromiseCache) return stripePromiseCache;
  
  try {
    const { data, error } = await supabase.functions.invoke('get-stripe-config');
    
    if (error) throw error;
    
    if (data?.publishableKey) {
      stripePromiseCache = loadStripe(data.publishableKey);
      return stripePromiseCache;
    }
  } catch (error) {
    console.error('Error loading Stripe config:', error);
  }
  
  return null;
};

// For backward compatibility
export const stripePromise = getStripePromise();
