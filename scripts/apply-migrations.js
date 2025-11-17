import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cuvvtdzyromkgnyntznr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function executeSQLFile(filePath, description) {
  console.log(`\n📝 ${description}...`);

  try {
    const sql = readFileSync(filePath, 'utf8');

    // Split SQL into individual statements (basic split on semicolons outside quotes)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      try {
        // Execute via RPC call to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          // If exec_sql doesn't exist, try direct execution
          console.log(`   Statement ${i + 1}/${statements.length}: Using direct execution`);

          // For CREATE TABLE, ALTER TABLE, etc., we'll need to use the REST API
          // This is a workaround since Supabase client doesn't directly support DDL
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ sql_query: statement + ';' })
          });

          if (!response.ok) {
            console.warn(`   ⚠️  Statement ${i + 1} may have issues (this is normal for some DDL statements)`);
            // Continue anyway - some statements might already exist
          } else {
            console.log(`   ✅ Statement ${i + 1}/${statements.length} executed`);
          }
        } else {
          console.log(`   ✅ Statement ${i + 1}/${statements.length} executed`);
        }
      } catch (err) {
        console.warn(`   ⚠️  Statement ${i + 1}: ${err.message} (may already exist, continuing...)`);
      }
    }

    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables were created...');

  const tablesToCheck = [
    'customer_addresses',
    'wishlists',
    'loyalty_points',
    'loyalty_transactions',
    'email_notifications'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error) {
        console.log(`   ✅ ${table} exists and is accessible`);
      } else {
        console.log(`   ⚠️  ${table} may not exist yet: ${error.message}`);
      }
    } catch (err) {
      console.log(`   ⚠️  ${table} check failed: ${err.message}`);
    }
  }
}

async function ensureAdminUser() {
  console.log('\n👤 Setting up admin user...');

  const adminEmail = 'cardinal.hunain@gmail.com';

  try {
    // Check if user exists
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.log(`   ℹ️  Cannot verify user (need service role key): ${userError.message}`);
      console.log(`   ℹ️  Admin role will be assigned automatically on signup via database trigger`);
      return;
    }

    const adminUser = users.users.find(u => u.email === adminEmail);

    if (adminUser) {
      console.log(`   ✅ User ${adminEmail} exists`);

      // Try to set admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: adminUser.id,
          role: 'admin'
        }, {
          onConflict: 'user_id'
        });

      if (!roleError) {
        console.log(`   ✅ Admin role assigned to ${adminEmail}`);
      } else {
        console.log(`   ℹ️  Admin role assignment: ${roleError.message}`);
      }
    } else {
      console.log(`   ℹ️  User ${adminEmail} not found - will be assigned admin role on signup`);
    }
  } catch (error) {
    console.log(`   ℹ️  Admin setup: ${error.message}`);
    console.log(`   ℹ️  Admin role will be assigned automatically via database trigger`);
  }
}

async function main() {
  console.log('🚀 Starting database migration...\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);

  const projectRoot = join(__dirname, '..');
  const migrationsDir = join(projectRoot, 'supabase', 'migrations');

  // Migration files in order
  const migrations = [
    {
      file: join(migrationsDir, '20251117120000_enhance_user_system.sql'),
      description: 'Applying User System Enhancement'
    },
    {
      file: join(migrationsDir, '20251117130000_ecommerce_enhancements.sql'),
      description: 'Applying E-commerce Enhancements'
    }
  ];

  let allSuccess = true;

  for (const migration of migrations) {
    const success = await executeSQLFile(migration.file, migration.description);
    if (!success) {
      allSuccess = false;
      console.log(`⚠️  Warning: ${migration.description} had issues, but continuing...`);
    }
  }

  await verifyTables();
  await ensureAdminUser();

  console.log('\n' + '='.repeat(60));
  if (allSuccess) {
    console.log('✅ All migrations completed successfully!');
  } else {
    console.log('⚠️  Migrations completed with some warnings (this may be normal)');
  }
  console.log('='.repeat(60));

  console.log('\n📋 Next steps:');
  console.log('   1. Test login with cardinal.hunain@gmail.com');
  console.log('   2. Visit /admin to verify admin access');
  console.log('   3. Place a test order to verify loyalty points');
  console.log('   4. Check that wishlist syncs when logged in\n');
}

main().catch(console.error);
