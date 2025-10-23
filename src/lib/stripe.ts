import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
// Note: This will be undefined until you add VITE_STRIPE_PUBLISHABLE_KEY to .env
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key is not set. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.');
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
