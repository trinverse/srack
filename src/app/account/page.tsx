import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AccountDashboard } from './account-dashboard';

export const metadata: Metadata = {
  title: 'My Account - The Spice Rack',
};

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  // Fetch customer profile
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  // If customer is barely created or still syncing in the background, provide a safe fallback 
  // so the page doesn't bounce them into an infinite loop with /login
  const safeCustomer = customer || {
    id: 'pending',
    auth_user_id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || 'My Account',
    phone: user.phone || '',
    role: 'customer',
    points: 0,
    created_at: new Date().toISOString(),
  };

  // Skip deep fetch queries if customer is pending
  const isPending = safeCustomer.id === 'pending';

  // Fetch customer addresses
  const { data: addresses } = !isPending
    ? await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', safeCustomer.id)
      .order('is_default', { ascending: false })
    : { data: [] };

  // Fetch recent orders
  const { data: orders } = !isPending
    ? await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        pickup_locations (name, address, city)
      `)
      .eq('customer_id', safeCustomer.id)
      .order('created_at', { ascending: false })
      .limit(10)
    : { data: [] };

  // Fetch loyalty transactions
  const { data: loyaltyTransactions } = !isPending
    ? await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('customer_id', safeCustomer.id)
      .order('created_at', { ascending: false })
      .limit(5)
    : { data: [] };

  return (
    <AccountDashboard
      customer={safeCustomer as any}
      addresses={addresses || []}
      orders={orders || []}
      loyaltyTransactions={loyaltyTransactions || []}
    />
  );
}
