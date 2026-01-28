import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get order stats
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get customer count
  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer');

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      *,
      customers (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  // Calculate revenue (simple sum)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('status', 'completed');

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  // Calculate this week's revenue
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyRevenue = revenueData?.reduce((sum, order) => {
    const orderDate = order.created_at ? new Date(order.created_at) : null;
    if (orderDate && orderDate >= startOfWeek) {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0) || 0;

  // Get top 5 customers by spending
  const { data: allOrders } = await supabase
    .from('orders')
    .select('customer_id, total, customers(full_name)')
    .eq('status', 'completed');

  const customerSpending: Record<string, { name: string; total: number }> = {};
  allOrders?.forEach((order) => {
    if (order.customer_id) {
      if (!customerSpending[order.customer_id]) {
        customerSpending[order.customer_id] = {
          name: order.customers?.full_name || 'Unknown',
          total: 0,
        };
      }
      customerSpending[order.customer_id].total += order.total || 0;
    }
  });

  const topCustomers = Object.entries(customerSpending)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map(([id, data]) => ({ id, ...data }));

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Total Customers',
      value: totalCustomers || 0,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'This Week',
      value: `$${weeklyRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-emerald-100 text-emerald-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'canceled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to The Spice Rack Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald/20 bg-emerald/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Menu Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update menu items, prices, and availability
            </p>
            <Button asChild size="sm">
              <Link href="/admin/menu">
                Manage Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Process Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and update order statuses
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">
                View Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-spice/20 bg-spice/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Kitchen Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate reports for kitchen prep
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/reports">
                View Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customers?.full_name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status || 'pending'
                      )}`}
                    >
                      {order.status?.replace('_', ' ') || 'pending'}
                    </span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Top Customers by Spending
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/customers">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {topCustomers.length > 0 ? (
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    ${customer.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customer data yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
