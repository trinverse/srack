import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ReportsManagement } from './reports-management';

export const metadata: Metadata = {
  title: 'Reports - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const supabase = await createClient();

  // Get orders for the current week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: weeklyOrders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .gte('created_at', startOfWeek.toISOString())
    .not('status', 'eq', 'canceled');

  // Get all order items with menu item details for kitchen report
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      customers (full_name)
    `)
    .in('status', ['pending', 'in_progress'])
    .order('order_day')
    .order('created_at');

  // Get menu items for reference (including has_size_options for product report)
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, category, has_size_options')
    .eq('is_active', true);

  // Get delivery orders for delivery route report
  const { data: deliveryOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_day,
      order_date,
      shipping_street_address,
      shipping_apartment,
      shipping_zip_code,
      shipping_city,
      shipping_building_name,
      shipping_gate_code,
      shipping_delivery_notes,
      shipping_parking_instructions,
      order_items (item_name, quantity, size),
      customers (full_name, phone, notes)
    `)
    .eq('order_type', 'delivery')
    .in('status', ['pending', 'in_progress', 'ready'])
    .order('shipping_zip_code');

  // Get all order items for product report aggregation
  const { data: allOrderItems } = await supabase
    .from('order_items')
    .select(`
      item_name,
      size,
      quantity,
      menu_item_id,
      orders!inner (order_day, status)
    `)
    .in('orders.status', ['pending', 'in_progress', 'ready']);

  // Get all completed orders for customer spending leaderboard
  const { data: allCompletedOrders } = await supabase
    .from('orders')
    .select('customer_id, total, customers(full_name)')
    .eq('status', 'completed');

  // Calculate customer spending leaderboard
  const customerSpending: Record<string, { name: string; total: number; orderCount: number }> = {};
  allCompletedOrders?.forEach((order) => {
    if (order.customer_id) {
      if (!customerSpending[order.customer_id]) {
        customerSpending[order.customer_id] = {
          name: order.customers?.full_name || 'Unknown',
          total: 0,
          orderCount: 0,
        };
      }
      customerSpending[order.customer_id].total += order.total || 0;
      customerSpending[order.customer_id].orderCount += 1;
    }
  });

  const customerLeaderboard = Object.entries(customerSpending)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .map(([id, data]) => ({ id, ...data }));

  return (
    <ReportsManagement
      weeklyOrders={weeklyOrders || []}
      pendingOrders={pendingOrders || []}
      menuItems={menuItems || []}
      customerLeaderboard={customerLeaderboard}
      deliveryOrders={deliveryOrders || []}
      allOrderItems={allOrderItems || []}
    />
  );
}
