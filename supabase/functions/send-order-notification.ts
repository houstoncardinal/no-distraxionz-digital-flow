import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, type, message, trackingNumber, carrier } = await req.json()

    // Here you would integrate with your email service
    // For now, we'll just log the notification
    console.log(`Order ${orderId} notification:`, {
      type,
      message,
      trackingNumber,
      carrier,
    })

    // In a real implementation, you'd send emails via:
    // - SendGrid, Mailgun, Postmark, etc.
    // - Or use Netlify's built-in email features

    return new Response(
      JSON.stringify({
        success: true,
        message: `Order notification sent for order ${orderId}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
