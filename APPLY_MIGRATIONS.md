# Apply Database Migrations

## Quick Instructions

### Option 1: Supabase Dashboard (Recommended)

1. Go to [https://supabase.com/dashboard/project/cuvvtdzyromkgnyntznr](https://supabase.com/dashboard/project/cuvvtdzyromkgnyntznr)
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query and run the following scripts in order:

#### Step 1: Apply User System Enhancement
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251117120000_enhance_user_system.sql
```

#### Step 2: Apply E-commerce Enhancements
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251117130000_ecommerce_enhancements.sql
```

#### Step 3: Ensure Admin User (Run this after migrations)
```sql
-- Make cardinal.hunain@gmail.com admin if they already exist
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the user ID for cardinal.hunain@gmail.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'cardinal.hunain@gmail.com';

  -- If user exists, update their role to admin
  IF admin_user_id IS NOT NULL THEN
    -- Remove any existing role
    DELETE FROM public.user_roles WHERE user_id = admin_user_id;

    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

    RAISE NOTICE 'Admin role assigned to cardinal.hunain@gmail.com';
  ELSE
    RAISE NOTICE 'User cardinal.hunain@gmail.com does not exist yet. Admin role will be assigned automatically on signup.';
  END IF;
END $$;
```

### Option 2: Lovable Dashboard

If you deployed via Lovable:
1. Go to your [Lovable project dashboard](https://lovable.dev)
2. Navigate to Database/Migrations section
3. The migrations should auto-apply on your next deployment

---

## What These Migrations Do

### Migration 1: Enhanced User System
- ✅ Creates `customer_addresses` table for saved shipping/billing addresses
- ✅ Adds address fields to profiles table
- ✅ Updates `handle_new_user()` function to automatically assign:
  - **Admin role** to `cardinal.hunain@gmail.com`
  - **Customer role** to all other new signups

### Migration 2: E-commerce Enhancements
- ✅ Creates `wishlists` table (database-synced wishlist)
- ✅ Creates `loyalty_points` table with 4-tier system
  - Bronze: 0-1,999 points
  - Silver: 2,000-4,999 points
  - Gold: 5,000-9,999 points
  - Platinum: 10,000+ points
- ✅ Creates `loyalty_transactions` table for points history
- ✅ Creates `email_notifications` table for tracking sent emails
- ✅ Adds database triggers:
  - Auto-award 1 point per $1 spent on orders
  - Automatic tier upgrades
  - Welcome email logging
  - Order confirmation email logging

---

## Verify Migrations Applied

Run this query to check if migrations were successful:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'customer_addresses',
  'wishlists',
  'loyalty_points',
  'loyalty_transactions',
  'email_notifications'
);
```

You should see all 5 tables listed.

---

## Test Admin Access

After applying migrations:

1. Log in to your site with `cardinal.hunain@gmail.com`
2. Navigate to `/admin` - you should have access
3. All other users will automatically be assigned the customer role

---

## Database Connection Info

- **Project URL**: https://cuvvtdzyromkgnyntznr.supabase.co
- **Project ID**: cuvvtdzyromkgnyntznr

---

## Troubleshooting

### If migrations fail:
1. Check if tables already exist: `SELECT * FROM customer_addresses LIMIT 1;`
2. If yes, the migration may have partially applied
3. Contact support or manually review each migration statement

### If admin role not working:
1. Run the "Ensure Admin User" query above
2. Check current role:
   ```sql
   SELECT r.role, u.email
   FROM user_roles r
   JOIN auth.users u ON u.id = r.user_id
   WHERE u.email = 'cardinal.hunain@gmail.com';
   ```
3. Should return `admin` as the role
