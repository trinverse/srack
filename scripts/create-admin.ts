/**
 * Create Admin User Script
 *
 * This script creates a test admin user for local development.
 *
 * Prerequisites:
 * - SUPABASE_SERVICE_ROLE_KEY environment variable (from Supabase Dashboard > Settings > API)
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 *
 * Or with custom credentials:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=your-password npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Default test admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@spicerackatlanta.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Test Admin';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '555-000-0000';

async function createAdminUser() {
  if (!SUPABASE_URL) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL is missing');
    console.log('\nMake sure .env.local contains NEXT_PUBLIC_SUPABASE_URL');
    process.exit(1);
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is required');
    console.log('\nTo get your service role key:');
    console.log('1. Go to https://supabase.com/dashboard/project/wwwkbbhvrmrjptxmalhp/settings/api');
    console.log('2. Copy the "service_role" key (keep it secret!)');
    console.log('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your-key');
    console.log('   Or run: SUPABASE_SERVICE_ROLE_KEY=your-key npm run db:create-admin');
    process.exit(1);
  }

  // Create admin client with service role key
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('🔧 Creating admin user...\n');

  // Step 1: Create auth user
  console.log(`📧 Email: ${ADMIN_EMAIL}`);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true, // Auto-confirm email for testing
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('ℹ️  Auth user already exists, fetching user ID...');

      // Get existing user
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users?.find(u => u.email === ADMIN_EMAIL);

      if (existingUser) {
        await upsertCustomer(supabase, existingUser.id);
      } else {
        console.error('❌ Could not find existing user');
        process.exit(1);
      }
    } else {
      console.error('❌ Error creating auth user:', authError.message);
      process.exit(1);
    }
  } else if (authData.user) {
    console.log(`✅ Auth user created: ${authData.user.id}`);
    await upsertCustomer(supabase, authData.user.id);
  }
}

async function upsertCustomer(supabase: ReturnType<typeof createClient>, authUserId: string) {
  // Step 2: Create or update customer record with admin role
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        auth_user_id: authUserId,
        email: ADMIN_EMAIL,
        full_name: ADMIN_NAME,
        phone: ADMIN_PHONE,
        role: 'admin',
        email_opt_in: true,
        sms_opt_in: false,
      },
      {
        onConflict: 'email',
      }
    )
    .select()
    .single();

  if (customerError) {
    console.error('❌ Error creating customer record:', customerError.message);
    process.exit(1);
  }

  console.log(`✅ Customer record created/updated with admin role`);
  console.log('\n────────────────────────────────────────');
  console.log('🎉 Admin user ready!\n');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role:     admin`);
  console.log('\n   Login at: http://localhost:3000/login');
  console.log('   Admin at: http://localhost:3000/admin');
  console.log('────────────────────────────────────────\n');
}

createAdminUser();
