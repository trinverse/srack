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

  if (!customer) {
    redirect('/login');
  }

  // Fetch customer addresses
  const { data: addresses } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customer.id)
    .order('is_default', { ascending: false });

  // Fetch recent orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      pickup_locations (name, address, city)
    `)
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch loyalty transactions
  const { data: loyaltyTransactions } = await supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <AccountDashboard
      customer={customer}
      addresses={addresses || []}
      orders={orders || []}
      loyaltyTransactions={loyaltyTransactions || []}
    />
  );
}
