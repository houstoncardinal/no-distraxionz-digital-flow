import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Payment intent request received", { method: req.method });

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { amount, currency = "usd", metadata = {} }: PaymentIntentRequest = await req.json();
    console.log("Creating payment intent for amount:", amount);

    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({ error: "Invalid amount. Minimum is $0.50" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Stripe PaymentIntent
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount).toString(),
        currency: currency,
        "automatic_payment_methods[enabled]": "true",
        ...Object.entries(metadata).reduce((acc, [key, value]) => ({
          ...acc,
          [`metadata[${key}]`]: value,
        }), {}),
      }),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      throw new Error(paymentIntent.error?.message || "Failed to create payment intent");
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create payment intent",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
