'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'] & {
  customers: Pick<Database['public']['Tables']['customers']['Row'], 'id' | 'full_name' | 'email' | 'phone' | 'is_vip'> | null;
  order_items: Database['public']['Tables']['order_items']['Row'][];
  pickup_locations: Pick<Database['public']['Tables']['pickup_locations']['Row'], 'name' | 'address' | 'city'> | null;
};

type OrderStatus = Database['public']['Enums']['order_status'];

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'hold', label: 'On Hold', color: 'bg-orange-100 text-orange-700' },
  { value: 'ready', label: 'Ready', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-700' },
];

interface OrdersManagementProps {
  initialOrders: Order[];
}

export function OrdersManagement({ initialOrders }: OrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const supabase = createClient();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customers?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customers?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.order_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(null);
    }
  };

  const exportDeliveryOrders = () => {
    const deliveryOrders = filteredOrders.filter((o) => o.order_type === 'delivery');

    const csvContent = [
      ['Order #', 'Customer', 'Phone', 'Address', 'Items', 'Total', 'Notes'].join(','),
      ...deliveryOrders.map((order) => [
        order.order_number,
        order.customers?.full_name || 'N/A',
        order.customers?.phone || 'N/A',
        `"${order.shipping_street_address ? `${order.shipping_street_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip_code}` : 'N/A'}"`,
        order.order_items.length,
        `$${order.total.toFixed(2)}`,
        `"${order.shipping_delivery_notes?.replace(/"/g, '""') || ''}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'in_progress').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button onClick={exportDeliveryOrders} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Delivery CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
            <p className="text-sm text-amber-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-indigo-700">{inProgressCount}</div>
            <p className="text-sm text-indigo-600">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-700">{readyCount}</div>
            <p className="text-sm text-emerald-600">Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'delivery' | 'pickup')}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Types</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{order.order_number}</span>
                        {order.customers?.is_vip && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customers?.full_name || 'Unknown Customer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.order_items.length} items
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        order.order_type === 'delivery'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {order.order_type}
                    </span>

                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, e.target.value as OrderStatus);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isUpdating === order.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(
                        order.status || 'pending'
                      )} ${isUpdating === order.id ? 'opacity-50' : ''}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    <div className="text-sm text-muted-foreground">
                      {order.created_at && format(new Date(order.created_at), 'MMM d, h:mm a')}
                    </div>

                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t bg-muted/30 p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold mb-3">Customer</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${order.customers?.email}`}
                            className="text-emerald hover:underline"
                          >
                            {order.customers?.email}
                          </a>
                        </div>
                        {order.customers?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${order.customers?.phone}`}
                              className="text-emerald hover:underline"
                            >
                              {order.customers?.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery/Pickup Info */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        {order.order_type === 'delivery' ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>
                              {order.shipping_street_address
                                ? `${order.shipping_street_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip_code}`
                                : 'No address provided'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">{order.pickup_locations?.name}</p>
                              <p className="text-muted-foreground">
                                {order.pickup_locations?.address}, {order.pickup_locations?.city}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">
                            {order.order_day}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.item_name} ({item.size})
                            </span>
                            <span className="font-medium">${item.total_price.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          {(order.discount_amount ?? 0) > 0 && (
                            <div className="flex justify-between text-sm text-emerald">
                              <span>Discount</span>
                              <span>-${(order.discount_amount ?? 0).toFixed(2)}</span>
                            </div>
                          )}
                          {(order.delivery_fee ?? 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Delivery Fee</span>
                              <span>${(order.delivery_fee ?? 0).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold mt-1">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.shipping_delivery_notes && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Delivery Notes</h4>
                      <p className="text-sm text-muted-foreground bg-white p-3 rounded-lg">
                        {order.shipping_delivery_notes}
                      </p>
                    </div>
                  )}

                  {/* Gift Order Info */}
                  {order.is_gift && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Gift Order</h4>
                      <div className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p>
                          <strong>Recipient:</strong> {order.recipient_name}
                        </p>
                        {order.recipient_phone && (
                          <p>
                            <strong>Phone:</strong> {order.recipient_phone}
                          </p>
                        )}
                        {order.recipient_notes && (
                          <p>
                            <strong>Notes:</strong> {order.recipient_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
