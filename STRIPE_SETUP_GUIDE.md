# Stripe Payment Integration - Setup Guide

## ✅ What's Been Completed

Your NO DISTRAXIONZ e-commerce site now has a complete Stripe payment integration! Here's what was implemented:

### 1. **Installed Packages**
- `@stripe/stripe-js` - Stripe.js library for frontend
- `@stripe/react-stripe-js` - React components for Stripe Elements
- `stripe` - Stripe Node.js library for backend

### 2. **Created Files**
- `src/lib/stripe.ts` - Stripe initialization
- `src/components/checkout/StripePaymentForm.tsx` - Payment form component
- `netlify/functions/create-payment-intent.ts` - Serverless function to create payment intents
- `src/pages/CheckoutWithStripe.tsx` - Complete checkout page with Stripe integration

### 3. **Updated Files**
- `.env` - Added Stripe secret key
- `.gitignore` - Added .env files to prevent committing secrets
- `src/App.tsx` - Updated to use new Stripe checkout

### 4. **Environment Variables Added**
```env
STRIPE_SECRET_KEY="sk_live_YOUR_SECRET_KEY"
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY"
```

---

## 🔴 CRITICAL: What You Need to Do Now

### Step 1: Get Your Stripe Publishable Key

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_live_`)
3. Add it to your `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_ACTUAL_KEY_HERE"
```

4. **Important:** Uncomment the line in `.env` and replace `YOUR_KEY_HERE` with your actual key

### Step 2: Configure Deployment Environment Variables

Since `.env` is now gitignored (for security), you must add these environment variables to your hosting platform:

#### For Vercel:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add these variables:
   - `STRIPE_SECRET_KEY` = Your Stripe secret key
   - `VITE_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key
4. Redeploy your application

#### For Netlify:
1. Go to **Site settings** → **Environment variables**
2. Add the same variables as above
3. Trigger a new deploy

### Step 3: Enable Payment Methods in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Enable the payment methods you want to accept:
   - ✅ Cards (Visa, Mastercard, Amex, Discover)
   - ✅ Apple Pay
   - ✅ Google Pay
   - Consider: Link, Afterpay, Klarna

### Step 4: Configure Webhooks (Optional but Recommended)

Webhooks allow you to receive real-time updates about payments:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/.netlify/functions/stripe-webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to environment variables:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
   ```

---

## 🧪 Testing Your Integration

### Test Mode (Recommended First)

Before going live, test with Stripe test keys:

1. Get test keys from: https://dashboard.stripe.com/test/apikeys
2. Replace your keys with test versions:
   - `STRIPE_SECRET_KEY="sk_test_..."`
   - `VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."`

### Test Card Numbers

Use these test cards in test mode:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

**Test Details:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Testing Checklist

- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Fill in shipping information
- [ ] Payment form loads correctly
- [ ] Test successful payment with `4242 4242 4242 4242`
- [ ] Test declined payment with `4000 0000 0000 0002`
- [ ] Verify order is created in database
- [ ] Check order confirmation page displays
- [ ] Verify payment appears in Stripe Dashboard

---

## 🔒 Security Best Practices

### ✅ Already Implemented
- ✅ `.env` files are gitignored
- ✅ Using Stripe Elements (PCI compliant)
- ✅ Payment processing on secure backend
- ✅ HTTPS required for production

### 🔐 Additional Recommendations
1. **Enable Stripe Radar** (fraud detection) - Free basic version available
2. **Set up 3D Secure** for European customers (SCA compliance)
3. **Monitor failed payments** in Stripe Dashboard
4. **Set up email notifications** for disputes
5. **Review security settings** regularly

---

## 📊 How the Payment Flow Works

1. **Customer adds items to cart** → Goes to checkout
2. **Fills shipping information** → Form validates
3. **Payment Intent created** → Backend creates Stripe PaymentIntent
4. **Stripe Elements loads** → Secure payment form appears
5. **Customer enters card** → Stripe validates in real-time
6. **Payment confirmed** → Stripe processes payment
7. **Order created** → Saved to Supabase database
8. **Confirmation page** → Customer sees order details

---

## 🚀 Going Live Checklist

Before switching to live mode:

- [ ] Complete Stripe account verification
- [ ] Add business information
- [ ] Connect bank account for payouts
- [ ] Test all payment flows thoroughly
- [ ] Switch from test keys to live keys
- [ ] Update environment variables on hosting platform
- [ ] Test one small live transaction
- [ ] Set up email receipts in Stripe
- [ ] Configure tax settings if needed
- [ ] Enable fraud protection (Radar)
- [ ] Set up webhook endpoints
- [ ] Monitor first few transactions closely

---

## 💰 Stripe Pricing

**Standard Pricing:**
- 2.9% + $0.30 per successful card charge (US)
- No setup fees or monthly fees
- International cards: +1.5%
- Currency conversion: +1%

**Additional Costs:**
- Disputes: $15 per dispute (refunded if won)
- Stripe Radar (advanced): $0.05 per transaction
- Stripe Tax: 0.5% of transaction

---

## 🆘 Troubleshooting

### Payment form not loading?
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Verify the key starts with `pk_live_` or `pk_test_`
- Check browser console for errors
- Ensure Stripe packages are installed: `npm install`

### "Payment setup failed" error?
- Verify `STRIPE_SECRET_KEY` is set correctly
- Check Netlify function logs for errors
- Ensure the secret key matches your publishable key (both test or both live)

### Orders not being created?
- Check Supabase connection
- Verify database tables exist
- Check browser console for errors
- Review order creation logic in `CheckoutWithStripe.tsx`

### Webhook not receiving events?
- Verify webhook URL is correct
- Check that endpoint is publicly accessible
- Ensure webhook secret is set correctly
- Review Stripe webhook logs in dashboard

---

## 📚 Additional Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Testing Guide:** https://stripe.com/docs/testing
- **API Reference:** https://stripe.com/docs/api
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Support:** https://support.stripe.com

---

## ✨ What's Next?

After completing the setup above, consider adding:

1. **Email Receipts** - Configure in Stripe Dashboard
2. **Subscription Support** - For recurring products
3. **Refund Handling** - Admin interface for refunds
4. **Invoice Generation** - PDF invoices for customers
5. **Analytics Integration** - Track conversion rates
6. **Multi-currency** - Accept payments in different currencies
7. **Saved Payment Methods** - Let customers save cards
8. **Apple Pay / Google Pay** - One-click checkout

---

## 🎉 You're Almost Ready!

Once you add your Stripe publishable key and configure your deployment environment variables, your payment system will be fully functional!

**Need help?** Check the Stripe documentation or reach out to Stripe support - they're very responsive!
