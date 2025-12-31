import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY);

const FROM_EMAIL = 'NO DISTRAXIONZ <orders@nodistraxionz.com>';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
  order_items?: Array<{
    product?: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

// Welcome email template
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to NO DISTRAXIONZ!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to NO DISTRAXIONZ</h1>
            </div>
            <div class="content">
              <h2>Hey ${name || 'there'}! 👋</h2>
              <p>Welcome to the NO DISTRAXIONZ family. You've just joined a community that values focus, quality, and unwavering dedication to excellence.</p>

              <h3>What's Next?</h3>
              <ul>
                <li><strong>Explore Our Collection</strong> - Discover premium apparel designed for the focused few</li>
                <li><strong>Earn Loyalty Points</strong> - Get 1 point for every $1 spent</li>
                <li><strong>Save Addresses</strong> - Speed up checkout with saved shipping info</li>
                <li><strong>Track Orders</strong> - Manage everything from your account dashboard</li>
              </ul>

              <div style="text-align: center;">
                <a href="${window.location.origin}/shop" class="button">Start Shopping</a>
              </div>

              <p>Questions? We're here to help. Reply to this email anytime.</p>

              <p>Stay focused,<br><strong>The NO DISTRAXIONZ Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 NO DISTRAXIONZ. All rights reserved.</p>
              <p>New Orleans, Louisiana</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

// Order confirmation email template
export async function sendOrderConfirmation(order: Order) {
  try {
    const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const itemsHTML = order.order_items?.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.product?.name || 'Product'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('') || '';

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Order Confirmation #${order.id.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .total { font-size: 18px; font-weight: bold; padding-top: 15px; border-top: 2px solid #000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Thanks for your order, ${order.customer_name}!</h2>
              <p>We've received your order and we're getting it ready. You'll receive a shipping confirmation email with tracking information once your order ships.</p>

              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> #${order.id.slice(0, 8)}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>

                <table>
                  <thead>
                    <tr style="background: #f0f0f0;">
                      <th style="padding: 10px; text-align: left;">Item</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                    <tr class="total">
                      <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                      <td style="padding: 15px; text-align: right;">$${Number(order.total_amount).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style="text-align: center;">
                <a href="${window.location.origin}/order/${order.id}" class="button">View Order Details</a>
              </div>

              <h3>What's Next?</h3>
              <ul>
                <li>We'll send you a shipping confirmation with tracking info</li>
                <li>Your order typically ships within 1-2 business days</li>
                <li>You earned <strong>${Math.floor(order.total_amount)} loyalty points</strong> with this purchase!</li>
              </ul>

              <p>Questions about your order? Reply to this email or visit your account dashboard.</p>

              <p>Stay focused,<br><strong>The NO DISTRAXIONZ Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 NO DISTRAXIONZ. All rights reserved.</p>
              <p>New Orleans, Louisiana</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    return { success: false, error };
  }
}

// Shipping update email template
export async function sendShippingUpdate(order: Order, trackingNumber: string, carrier: string = 'USPS') {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Your Order Has Shipped! #${order.id.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .tracking-box { background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid #4CAF50; text-align: center; }
            .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Your Order is On Its Way!</h1>
            </div>
            <div class="content">
              <h2>Good news, ${order.customer_name}!</h2>
              <p>Your NO DISTRAXIONZ order has shipped and is heading your way.</p>

              <div class="tracking-box">
                <h3>Tracking Information</h3>
                <p><strong>Carrier:</strong> ${carrier}</p>
                <p><strong>Tracking Number:</strong></p>
                <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">${trackingNumber}</p>
                <a href="https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}" class="button">Track Your Package</a>
              </div>

              <p><strong>Order #${order.id.slice(0, 8)}</strong></p>
              <p><strong>Total: $${Number(order.total_amount).toFixed(2)}</strong></p>

              <h3>Delivery Info</h3>
              <p>Your package should arrive within 4-7 business days. Keep an eye out for it!</p>

              <p>Questions about your delivery? Just reply to this email.</p>

              <p>Stay focused,<br><strong>The NO DISTRAXIONZ Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 NO DISTRAXIONZ. All rights reserved.</p>
              <p>New Orleans, Louisiana</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending shipping update:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send shipping update:', error);
    return { success: false, error };
  }
}

export default {
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendShippingUpdate
};
