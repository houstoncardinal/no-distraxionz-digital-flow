# Run Database Migrations - Quick Guide

Since you don't have access to the Supabase dashboard, here's how to run the migrations automatically:

## Option 1: Using Node.js Script (Recommended)

I've created a migration script for you. Here's how to use it:

### Step 1: Install PostgreSQL Client
```bash
npm install pg
```

### Step 2: Get Your Database Password

Your database password is stored in your Supabase project. To get it:

1. Contact your Lovable/Supabase project admin, OR
2. If you have access to Lovable dashboard, find it in project settings, OR
3. Check your local `.env` files for `SUPABASE_DB_PASSWORD`

### Step 3: Run the Migration

```bash
# Set your database password and run migrations
SUPABASE_DB_PASSWORD="your-password-here" npm run migrate
```

**That's it!** The script will:
- ✅ Connect to your Supabase database
- ✅ Run both migration files
- ✅ Create all tables (customer_addresses, wishlists, loyalty_points, etc.)
- ✅ Set up cardinal.hunain@gmail.com as admin
- ✅ Verify everything was created successfully

---

## Option 2: Using Lovable CLI (If Available)

If your project is hosted on Lovable, migrations might auto-apply on deployment:

```bash
# Deploy your project
lovable deploy
```

Lovable automatically detects and runs new migration files.

---

## Option 3: Manual SQL Execution (If You Get Database Access)

If you get access to a database client (like pgAdmin, DBeaver, or psql), you can manually run:

**File 1:** `supabase/migrations/20251117120000_enhance_user_system.sql`
**File 2:** `supabase/migrations/20251117130000_ecommerce_enhancements.sql`

Just copy-paste each file's contents and execute.

---

## Troubleshooting

### Error: "command not found: npm"
You're not in your development environment. Navigate to your project directory:
```bash
cd /Users/hunainqureshi/Desktop/no-distraxionz-digital-flow-5
npm install pg
npm run migrate
```

### Error: "Connection refused"
- Check your internet connection
- Verify the database password is correct
- Ensure your Supabase project is active

### Error: "permission denied"
- You need the database password (not the API key)
- The password is different from `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## What Gets Created

### Tables
- ✅ `customer_addresses` - Saved shipping/billing addresses
- ✅ `wishlists` - Database-synced wishlists
- ✅ `loyalty_points` - User points and tier tracking
- ✅ `loyalty_transactions` - Points transaction history
- ✅ `email_notifications` - Email send log

### Functions & Triggers
- ✅ Auto-assign admin role to cardinal.hunain@gmail.com
- ✅ Auto-award loyalty points on orders (1 point per $1)
- ✅ Auto-upgrade loyalty tier when thresholds reached
- ✅ Log welcome and order confirmation emails

---

## Verify Migrations Worked

After running migrations, test:

1. **Login** with cardinal.hunain@gmail.com
2. **Visit** `/admin` - you should have access
3. **Place a test order** - loyalty points should be awarded
4. **Check wishlist** - should persist when you log in

---

## Need Help?

If you're stuck, you can:
1. Share your database password securely (via private channel)
2. Request Supabase dashboard access from your project admin
3. Use Lovable's built-in deployment (auto-migrates)

---

## Connection Details

- **Project URL**: https://cuvvtdzyromkgnyntznr.supabase.co
- **Project ID**: cuvvtdzyromkgnyntznr
- **Region**: US West 1

Your connection string format:
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```
