import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { state, subtotal } = await req.json();

    if (!state || typeof subtotal !== 'number') {
      return new Response(
        JSON.stringify({ error: 'State and subtotal are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Normalize state code to uppercase
    const stateCode = state.trim().toUpperCase();

    // Query tax rate for the destination state
    const { data: taxRates, error } = await supabase
      .from('tax_rates')
      .select('rate')
      .eq('country', 'US')
      .eq('state', stateCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching tax rate:', error);
      throw error;
    }

    // Default to 0% if no rate found (shouldn't happen with our data)
    const taxRate = taxRates?.rate || 0;
    const taxAmount = subtotal * (taxRate / 100);

    console.log(`Tax calculation for ${stateCode}: ${taxRate}% on $${subtotal} = $${taxAmount.toFixed(2)}`);

    return new Response(
      JSON.stringify({
        state: stateCode,
        rate: taxRate,
        amount: parseFloat(taxAmount.toFixed(2)),
        subtotal: subtotal
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in calculate-tax function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to calculate tax',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});