import Stripe from 'stripe';
import type { Context } from '@netlify/functions';

// Initialize Stripe - will be validated on first request
const getStripe = (): Stripe => {
  const secretKey = Netlify.env.get('STRIPE_SECRET_KEY');
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(secretKey);
};

export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { amount, currency = 'usd', metadata = {} } = body;

    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Minimum is $0.50' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripe = getStripe();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error creating payment intent:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return new Response(
        JSON.stringify({
          error: 'Payment service configuration error',
          message: 'The payment service is not properly configured. Please contact support.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      return new Response(
        JSON.stringify({
          error: 'Payment service unavailable',
          message: 'The payment service is not configured. Please contact support.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to create payment intent',
        message: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

