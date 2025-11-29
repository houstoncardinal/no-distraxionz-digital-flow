import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('Stripe publishable key is not configured');
}

export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null;
