import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CustomersManagement } from './customers-management';

export const metadata: Metadata = {
  title: 'Customers - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  // Fetch customers with their order stats
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  // Fetch order stats per customer (count, total spent, last order date)
  // Only count completed orders for spending
  const { data: orderStats } = await supabase
    .from('orders')
    .select('customer_id, id, total, created_at, status')
    .not('customer_id', 'is', null);

  // Calculate stats per customer
  const customerStatsMap: Record<string, {
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string | null;
  }> = {};

  orderStats?.forEach((order) => {
    if (order.customer_id) {
      if (!customerStatsMap[order.customer_id]) {
        customerStatsMap[order.customer_id] = {
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: null,
        };
      }
      customerStatsMap[order.customer_id].orderCount += 1;
      // Only count completed orders for total spent
      if (order.status === 'completed') {
        customerStatsMap[order.customer_id].totalSpent += order.total || 0;
      }
      // Track last order date
      const orderDate = order.created_at;
      const currentLastDate = customerStatsMap[order.customer_id].lastOrderDate;
      if (orderDate && (!currentLastDate || orderDate > currentLastDate)) {
        customerStatsMap[order.customer_id].lastOrderDate = orderDate;
      }
    }
  });

  const customersWithStats = customers?.map((customer) => ({
    ...customer,
    orderCount: customerStatsMap[customer.id]?.orderCount || 0,
    totalSpent: customerStatsMap[customer.id]?.totalSpent || 0,
    lastOrderDate: customerStatsMap[customer.id]?.lastOrderDate || null,
  }));

  return <CustomersManagement initialCustomers={customersWithStats || []} />;
}
