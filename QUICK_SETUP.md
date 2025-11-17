# 🚀 Quick Setup - Run This Now

I can't directly execute the migrations without your database password, but I've made it super easy for you!

## ⚡ Fastest Way (3 Commands)

Open your terminal in this project folder and run:

```bash
# 1. Install the database client
npm install pg

# 2. Run migrations (replace YOUR_PASSWORD with actual password)
SUPABASE_DB_PASSWORD="YOUR_PASSWORD" npm run migrate
```

**That's it!** Everything will be set up automatically.

---

## 🔐 Where to Find Your Password

### Option A: Check Your .env File
Your password might already be in your `.env` file. Look for:
- `SUPABASE_DB_PASSWORD`
- `DATABASE_PASSWORD`
- `DB_PASSWORD`

### Option B: Lovable Dashboard
1. Go to [Lovable.dev](https://lovable.dev)
2. Open your project
3. Settings → Database → View Password

### Option C: Email/Documentation
Check your Supabase welcome email or project documentation.

---

## 🎯 What Happens When You Run It

The script will automatically:

1. ✅ Connect to your Supabase database
2. ✅ Create 5 new tables:
   - `customer_addresses` (saved shipping addresses)
   - `wishlists` (database-synced wishlist)
   - `loyalty_points` (points tracking)
   - `loyalty_transactions` (points history)
   - `email_notifications` (email log)
3. ✅ Set up automatic triggers:
   - Award loyalty points on every order
   - Upgrade tier automatically
   - Log email notifications
4. ✅ Make cardinal.hunain@gmail.com an admin
5. ✅ Verify everything works

---

## ✅ How to Verify It Worked

After running the script, you should see:

```
✅ Connected!
✅ User System Enhancement completed
✅ E-commerce Enhancements completed
✅ Found 5/5 tables:
   - customer_addresses
   - email_notifications
   - loyalty_points
   - loyalty_transactions
   - wishlists
✅ Admin user setup complete
🎉 All migrations completed successfully!
```

Then test:
1. Login with cardinal.hunain@gmail.com
2. Visit `/admin` - you'll have access
3. Your account page will show the Rewards tab
4. Place a test order - you'll earn points!

---

## 🆘 Having Trouble?

### Can't find npm?
Make sure you're in the project directory:
```bash
cd /Users/hunainqureshi/Desktop/no-distraxionz-digital-flow-5
which npm  # Should show npm location
```

### Wrong password?
The error will say "password authentication failed"
- Try checking Lovable dashboard again
- The password is NOT the same as your API key

### Still stuck?
Run this to see detailed error info:
```bash
SUPABASE_DB_PASSWORD="YOUR_PASSWORD" node scripts/run-migrations.mjs
```

---

## 🎁 Bonus: Future Deployments

Once you run this once, you're done! Future deployments will automatically include these tables because the migration files are saved in your repo.

---

**Ready? Run the 2 commands above and you're all set!** ⚡
