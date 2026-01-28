import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { OrdersManagement } from './orders-management';

export const metadata: Metadata = {
  title: 'Orders - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // Fetch orders with customer and items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      customers (id, full_name, email, phone, is_vip),
      order_items (*),
      pickup_locations (name, address, city)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return <OrdersManagement initialOrders={orders || []} />;
}
