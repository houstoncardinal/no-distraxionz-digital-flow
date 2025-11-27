# Deployment Guide - No Distraxionz

## 🔐 Security Setup (IMPORTANT)

### Local Development
Your API keys are stored in `.env.local` which is **NOT** committed to git.
- ✅ `.env.local` contains your actual keys (gitignored)
- ✅ `.env` only contains placeholders (gitignored)
- ✅ Never commit real API keys to the repository

### Production Deployment on Netlify

#### 1. Set Environment Variables in Netlify

Go to your Netlify site dashboard:
**Site settings** → **Environment variables** → **Add a variable**

Add these variables:

```bash
# Stripe Configuration (REQUIRED for payments)
# Get from: https://dashboard.stripe.com/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY

# Supabase Configuration (REQUIRED for database/auth)
# Get from: https://supabase.com/dashboard → Project → Settings → API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Email Configuration (Optional)
# Get from: https://resend.com/api-keys
VITE_RESEND_API_KEY=re_your_resend_key_here

# Google Analytics (Optional)
VITE_GTAGS_ID=G-YQHPFM778J
```

**📝 NOTE:** Your actual keys are stored securely in `.env.local` for local development.
For production, copy the values from `.env.local` to Netlify's environment variables.

#### 2. Deploy

Once environment variables are set, deploy:
- Push to GitHub (already connected)
- Netlify will automatically build and deploy
- Serverless functions will work with the environment variables

---

## 🚀 Local Development

### Prerequisites
```bash
npm install -g netlify-cli
```

### Running Locally

**IMPORTANT:** Use `netlify dev` instead of `npm run dev` to enable serverless functions:

```bash
# 1. Make sure .env.local has your API keys (already done)
# 2. Run with Netlify Dev
netlify dev

# 3. Open browser to http://localhost:8888
```

This will:
- Start Vite dev server on port 5173
- Start Netlify Functions server
- Load environment variables from `.env.local`
- Enable Stripe payment processing locally

---

## ⚠️ IMPORTANT NOTES

### Live vs Test Keys

You are currently using **LIVE** Stripe keys:
- `pk_live_...` - Live publishable key
- `sk_live_...` - Live secret key

**This means:**
- ✅ Real payments will be processed
- ✅ Real credit cards will be charged
- ⚠️ For testing, use Stripe test mode cards: https://stripe.com/docs/testing

**For development/testing**, consider using TEST keys instead:
- Get test keys from: https://dashboard.stripe.com/test/apikeys
- Test keys start with `pk_test_` and `sk_test_`
- No real charges are made with test keys

### Supabase Setup

You still need to add your Supabase credentials to both:
1. `.env.local` (local development)
2. Netlify environment variables (production)

Get them from: https://supabase.com/dashboard → Your Project → Settings → API

---

## 📋 Checklist Before Launch

- [ ] Add Supabase credentials to `.env.local`
- [ ] Add Supabase credentials to Netlify environment variables
- [ ] Test checkout flow locally with `netlify dev`
- [ ] Verify Stripe webhooks are configured (if using)
- [ ] Test on production Netlify site
- [ ] Verify all serverless functions work
- [ ] Check that payments process correctly
- [ ] Ensure email confirmations work (if using Resend)

---

## 🔧 Troubleshooting

### Checkout Page Shows 500 Error
- Make sure you're running with `netlify dev`, not `npm run dev`
- Verify `STRIPE_SECRET_KEY` is set in `.env.local`

### Blank White Screen
- Check that Supabase credentials are set
- Open browser console (F12) to see errors

### Functions Not Working
- Ensure `netlify.toml` is in the repository (✅ already done)
- Verify functions are in `netlify/functions/` directory (✅ already done)
- Check Netlify build logs for errors

---

## 📁 File Structure

```
.env.example          # Template with placeholder values (committed to git)
.env                  # Template with placeholder values (gitignored)
.env.local            # YOUR ACTUAL KEYS (gitignored, NOT committed)
netlify.toml          # Netlify configuration (committed to git)
netlify/functions/    # Serverless functions (committed to git)
```

---

## 🎯 Next Steps

1. Add your Supabase credentials to `.env.local`
2. Run `netlify dev` to test locally
3. Add all environment variables to Netlify
4. Test the deployed site

Your Stripe payment integration is ready to go! 🚀
