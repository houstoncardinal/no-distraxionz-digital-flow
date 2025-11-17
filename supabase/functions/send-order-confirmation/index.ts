import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const generateOrderEmailHTML = (order: OrderDetails) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 2px;">NO DISTRAXIONZ</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Premium Streetwear</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px; text-align: center; background-color: #f8f9fa;">
                  <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 28px;">Order Confirmed!</h2>
                  <p style="margin: 0; color: #666; font-size: 16px;">Thank you for your purchase, ${order.customerName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Number</p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 20px; font-weight: bold;">#${order.orderNumber}</p>
                  </div>
                  <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px;">Order Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; color: #666; font-size: 14px;">Item</th>
                        <th style="padding: 12px; text-align: center; color: #666; font-size: 14px;">Qty</th>
                        <th style="padding: 12px; text-align: right; color: #666; font-size: 14px;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHTML}</tbody>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Subtotal:</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Shipping:</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">$${order.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Tax:</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">$${order.tax.toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #1a1a1a;">
                      <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total:</td>
                      <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #1a1a1a;">$${order.total.toFixed(2)}</td>
                    </tr>
                  </table>
                  <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 16px;">Shipping Address</h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                      ${order.shippingAddress.address}<br>
                      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Need help?</p>
                  <p style="margin: 0; color: #1a1a1a; font-size: 14px;">Contact us at support@nodistraxionz.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const orderDetails: OrderDetails = await req.json();

    const emailHTML = generateOrderEmailHTML(orderDetails);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NO DISTRAXIONZ <orders@nodistraxionz.com>",
        to: [orderDetails.customerEmail],
        subject: `Order Confirmation - #${orderDetails.orderNumber}`,
        html: emailHTML,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
