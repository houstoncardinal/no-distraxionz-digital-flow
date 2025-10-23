import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 2px;">NO DISTRAXIONZ</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Premium Streetwear</p>
                </td>
              </tr>

              <!-- Success Message -->
              <tr>
                <td style="padding: 40px; text-align: center; background-color: #f8f9fa;">
                  <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 30px;">✓</span>
                  </div>
                  <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 28px;">Order Confirmed!</h2>
                  <p style="margin: 0; color: #666; font-size: 16px;">Thank you for your purchase, ${order.customerName}</p>
                </td>
              </tr>

              <!-- Order Details -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Order Number</p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 20px; font-weight: bold;">#${order.orderNumber}</p>
                  </div>

                  <!-- Items Table -->
                  <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px;">Order Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; color: #666; font-size: 14px; font-weight: 600;">Item</th>
                        <th style="padding: 12px; text-align: center; color: #666; font-size: 14px; font-weight: 600;">Qty</th>
                        <th style="padding: 12px; text-align: right; color: #666; font-size: 14px; font-weight: 600;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHTML}
                    </tbody>
                  </table>

                  <!-- Totals -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Subtotal</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Shipping</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Tax</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">$${order.tax.toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #1a1a1a;">
                      <td style="padding: 12px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">Total</td>
                      <td style="padding: 12px 0; text-align: right; color: #1a1a1a; font-size: 18px; font-weight: bold;">$${order.total.toFixed(2)}</td>
                    </tr>
                  </table>

                  <!-- Shipping Address -->
                  <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">Shipping Address</h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                      ${order.customerName}<br>
                      ${order.shippingAddress.address}<br>
                      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
                    </p>
                  </div>

                  <!-- Tracking Info -->
                  <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                      <strong>📦 Shipping Update</strong><br>
                      Your order will be processed within 1-2 business days. You'll receive a shipping confirmation email with tracking information once your order ships.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 40px; background-color: #1a1a1a; text-align: center;">
                  <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px;">Questions about your order?</p>
                  <p style="margin: 0 0 20px 0; color: #999; font-size: 14px;">Contact us at support@nodistraxionz.com</p>
                  <div style="margin: 20px 0;">
                    <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 14px;">Track Order</a>
                    <span style="color: #666;">|</span>
                    <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 14px;">Returns</a>
                    <span style="color: #666;">|</span>
                    <a href="#" style="color: #999; text-decoration: none; margin: 0 10px; font-size: 14px;">FAQ</a>
                  </div>
                  <p style="margin: 20px 0 0 0; color: #666; font-size: 12px;">
                    © 2025 NO DISTRAXIONZ. All rights reserved.
                  </p>
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

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const orderDetails: OrderDetails = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: 'NO DISTRAXIONZ <orders@nodistraxionz.com>',
      to: [orderDetails.customerEmail],
      subject: `Order Confirmation #${orderDetails.orderNumber}`,
      html: generateOrderEmailHTML(orderDetails),
    });

    if (error) {
      console.error('Error sending email:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email', details: error }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, messageId: data?.id }),
    };
  } catch (error: any) {
    console.error('Error in send-order-confirmation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message }),
    };
  }
};
