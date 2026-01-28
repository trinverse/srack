'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Star,
  Mail,
  Phone,
  ShoppingCart,
  Calendar,
  Crown,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Customer = Database['public']['Tables']['customers']['Row'] & {
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
};

interface CustomersManagementProps {
  initialCustomers: Customer[];
}

type SortField = 'name' | 'orders' | 'spent' | 'date';
type SortDirection = 'asc' | 'desc';

export function CustomersManagement({ initialCustomers }: CustomersManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVip, setFilterVip] = useState<'all' | 'vip' | 'regular'>('all');
  const [sortField, setSortField] = useState<SortField>('spent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const supabase = createClient();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery);

    const matchesVip =
      filterVip === 'all' ||
      (filterVip === 'vip' && customer.is_vip) ||
      (filterVip === 'regular' && !customer.is_vip);

    return matchesSearch && matchesVip;
  }).sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return multiplier * (a.full_name || '').localeCompare(b.full_name || '');
      case 'orders':
        return multiplier * (a.orderCount - b.orderCount);
      case 'spent':
        return multiplier * (a.totalSpent - b.totalSpent);
      case 'date':
        if (!a.lastOrderDate && !b.lastOrderDate) return 0;
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return multiplier * a.lastOrderDate.localeCompare(b.lastOrderDate);
      default:
        return 0;
    }
  });

  const toggleVipStatus = async (customerId: string, currentVip: boolean) => {
    setIsUpdating(customerId);
    try {
      const { error } = await supabase
        .from('customers')
        .update({ is_vip: !currentVip })
        .eq('id', customerId);

      if (error) throw error;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, is_vip: !currentVip } : customer
        )
      );
    } catch (error) {
      console.error('Error updating VIP status:', error);
      alert('Failed to update VIP status');
    } finally {
      setIsUpdating(null);
    }
  };

  const vipCount = customers.filter((c) => c.is_vip).length;
  const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage customer accounts and VIP status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-700">{vipCount}</div>
            <p className="text-sm text-amber-600">VIP Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-700">${totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-emerald-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${customers.length > 0 ? (totalRevenue / customers.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-sm text-muted-foreground">Avg Spend/Customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterVip}
                onChange={(e) => setFilterVip(e.target.value as 'all' | 'vip' | 'regular')}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Customers</option>
                <option value="vip">VIP Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>
            {/* Sort Options */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant={sortField === 'spent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('spent')}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Total Spent
                {sortField === 'spent' && (
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                )}
              </Button>
              <Button
                variant={sortField === 'orders' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('orders')}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                Orders
                {sortField === 'orders' && (
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                )}
              </Button>
              <Button
                variant={sortField === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('date')}
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Last Order
                {sortField === 'date' && (
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                )}
              </Button>
              <Button
                variant={sortField === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('name')}
              >
                Name
                {sortField === 'name' && (
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No customers found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center">
                      <span className="text-emerald font-bold text-lg">
                        {customer.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{customer.full_name || 'No Name'}</span>
                        {customer.is_vip && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <Crown className="h-3 w-3" />
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-lg font-semibold text-emerald-600">
                        <DollarSign className="h-4 w-4" />
                        {customer.totalSpent.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        {customer.orderCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        {customer.loyalty_points || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="text-center hidden lg:block">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.lastOrderDate
                          ? format(new Date(customer.lastOrderDate), 'MMM d, yyyy')
                          : 'Never'}
                      </div>
                      <p className="text-xs text-muted-foreground">Last Order</p>
                    </div>

                    <Button
                      variant={customer.is_vip ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleVipStatus(customer.id, customer.is_vip || false)}
                      disabled={isUpdating === customer.id}
                      className={customer.is_vip ? 'bg-amber-500 hover:bg-amber-600' : ''}
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      {customer.is_vip ? 'Remove VIP' : 'Make VIP'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
