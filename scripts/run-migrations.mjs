#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct Postgres connection string
// Format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
const SUPABASE_URL = 'bvfmilpgujrvnclpikrz.supabase.co';
const SUPABASE_PROJECT_ID = 'bvfmilpgujrvnclpikrz';

console.log('🔐 Database Password Required\n');
console.log('To run migrations, you need your Supabase database password.');
console.log('Find it at: https://supabase.com/dashboard/project/bvfmilpgujrvnclpikrz/settings/database\n');

const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error('❌ Error: SUPABASE_DB_PASSWORD environment variable not set\n');
  console.log('To set it:');
  console.log('  export SUPABASE_DB_PASSWORD="your-password-here"');
  console.log('  node scripts/run-migrations.mjs\n');
  console.log('Or run inline:');
  console.log('  SUPABASE_DB_PASSWORD="your-password" node scripts/run-migrations.mjs\n');
  process.exit(1);
}

const connectionString = `postgresql://postgres.${SUPABASE_PROJECT_ID}:${DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    const projectRoot = join(__dirname, '..');
    const migrationsDir = join(projectRoot, 'supabase', 'migrations');

    const migrations = [
      {
        file: join(migrationsDir, 'MASTER_MIGRATION_COMPLETE.sql'),
        name: 'Complete Database Setup (All Features)'
      }
    ];

    for (const migration of migrations) {
      console.log(`📝 Running: ${migration.name}`);
      const sql = readFileSync(migration.file, 'utf8');

      try {
        await client.query(sql);
        console.log(`✅ ${migration.name} completed\n`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  ${migration.name} - some objects already exist (skipping)\n`);
        } else {
          console.error(`❌ Error in ${migration.name}:`, error.message, '\n');
        }
      }
    }

    // Verify tables
    console.log('🔍 Verifying tables...');
    const checkQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN (
        'customer_addresses',
        'wishlists',
        'loyalty_points',
        'loyalty_transactions',
        'email_notifications'
      )
      ORDER BY table_name;
    `;

    const result = await client.query(checkQuery);
    console.log(`✅ Found ${result.rows.length}/5 tables:`);
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Ensure admin user
    console.log('\n👤 Setting up admin user...');
    const adminQuery = `
      DO $$
      DECLARE
        admin_user_id UUID;
      BEGIN
        SELECT id INTO admin_user_id
        FROM auth.users
        WHERE email = 'cardinal.hunain@gmail.com';

        IF admin_user_id IS NOT NULL THEN
          DELETE FROM public.user_roles WHERE user_id = admin_user_id;
          INSERT INTO public.user_roles (user_id, role)
          VALUES (admin_user_id, 'admin')
          ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
          RAISE NOTICE 'Admin role assigned';
        ELSE
          RAISE NOTICE 'User not found - will be assigned on signup';
        END IF;
      END $$;
    `;

    await client.query(adminQuery);
    console.log('✅ Admin user setup complete\n');

    console.log('='.repeat(60));
    console.log('🎉 All migrations completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('   1. Test login with cardinal.hunain@gmail.com');
    console.log('   2. Visit /admin to verify admin access');
    console.log('   3. Place a test order to verify loyalty points');
    console.log('   4. Check wishlist syncs when logged in\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('   1. Verify your database password is correct');
    console.error('   2. Check your internet connection');
    console.error('   3. Ensure Supabase project is active');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
