import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * POST /api/auth/signup
 * Creates a customer record using the service role key (bypasses RLS).
 * Also auto-confirms the user's email so they can sign in immediately.
 *
 * Body: { authUserId: string, email: string, fullName: string, phone: string, smsOptIn?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const { authUserId, email, fullName, phone, smsOptIn } = await request.json();

    if (!authUserId || !email || !fullName) {
      return NextResponse.json(
        { error: 'authUserId, email, and fullName are required' },
        { status: 400 }
      );
    }

    // Use service role key to bypass RLS and access admin APIs
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('[Signup] SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    // Auto-confirm the user's email so they can sign in immediately
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      authUserId,
      { email_confirm: true }
    );

    if (confirmError) {
      console.error('[Signup] Error auto-confirming email:', confirmError);
      // Don't fail signup — they can still confirm via email
    }

    // Check if customer already exists by auth_user_id OR email (handles retries & duplicates)
    const { data: existingById } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_user_id', authUserId)
      .single();

    if (existingById) {
      return NextResponse.json({ success: true, customerId: existingById.id });
    }

    const { data: existingByEmail } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingByEmail) {
      // Link the existing customer record to this auth user
      await supabaseAdmin
        .from('customers')
        .update({ auth_user_id: authUserId })
        .eq('id', existingByEmail.id);
      return NextResponse.json({ success: true, customerId: existingByEmail.id });
    }

    // Create the customer record
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .insert({
        auth_user_id: authUserId,
        email,
        full_name: fullName,
        phone: phone || '',
        role: 'customer',
        email_opt_in: true,
        sms_opt_in: smsOptIn === true,
      })
      .select('id')
      .single();

    if (customerError) {
      // Handle unique constraint violations as success (race condition with duplicate requests)
      if (customerError.code === '23505') {
        const { data: justCreated } = await supabaseAdmin
          .from('customers')
          .select('id')
          .eq('auth_user_id', authUserId)
          .single();
        if (justCreated) {
          return NextResponse.json({ success: true, customerId: justCreated.id });
        }
      }

      console.error('[Signup] Error creating customer:', JSON.stringify(customerError));
      return NextResponse.json(
        { error: customerError.message || 'Failed to create customer profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, customerId: customer.id });
  } catch (err) {
    console.error('[Signup] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
