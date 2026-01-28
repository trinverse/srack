'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  User,
  MapPin,
  ShoppingCart,
  Star,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Customer = Database['public']['Tables']['customers']['Row'];
type Address = Database['public']['Tables']['customer_addresses']['Row'];
type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: Database['public']['Tables']['order_items']['Row'][];
  pickup_locations: Pick<Database['public']['Tables']['pickup_locations']['Row'], 'name' | 'address' | 'city'> | null;
};
type LoyaltyTransaction = Database['public']['Tables']['loyalty_transactions']['Row'];

interface AccountDashboardProps {
  customer: Customer;
  addresses: Address[];
  orders: Order[];
  loyaltyTransactions: LoyaltyTransaction[];
}

export function AccountDashboard({
  customer: initialCustomer,
  addresses: initialAddresses,
  orders,
  loyaltyTransactions,
}: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'loyalty'>(
    'orders'
  );
  const [customer, setCustomer] = useState(initialCustomer);

  // Check if user is staff (admin, kitchen, or marketing)
  const isStaff = ['admin', 'kitchen', 'marketing'].includes(customer.role || '');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: customer.full_name || '',
    phone: customer.phone || '',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_type: '',
    street_address: '',
    city: '',
    state: 'GA',
    zip_code: '',
  });

  const supabase = createClient();

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
        })
        .eq('id', customer.id);

      if (error) throw error;

      setCustomer({
        ...customer,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customer.id,
          ...newAddress,
          is_default: addresses.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses([...addresses, data]);
      setIsAddingAddress(false);
      setNewAddress({
        address_type: '',
        street_address: '',
        city: '',
        state: 'GA',
        zip_code: '',
      });
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      const { error } = await supabase.from('customer_addresses').delete().eq('id', id);
      if (error) throw error;
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customer.id);

      // Then set the new default
      const { error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      setAddresses(
        addresses.map((a) => ({
          ...a,
          is_default: a.id === id,
        }))
      );
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'in_progress':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'ready':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-700';
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
    <div className="min-h-screen bg-muted/30 pt-28 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Dashboard Banner for Staff */}
        {isStaff && (
          <Card className="mb-6 border-emerald bg-emerald/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald/10 rounded-full">
                    <Shield className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald">Staff Access</p>
                    <p className="text-sm text-muted-foreground">
                      You have access to the admin dashboard
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    Go to Admin Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground">
            Welcome back, {customer.full_name || 'Customer'}!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-700">
                {customer.loyalty_points || 0}
              </div>
              <p className="text-sm text-amber-600">Loyalty Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{addresses.length}</div>
              <p className="text-sm text-muted-foreground">Saved Addresses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {customer.is_vip ? 'VIP' : 'Standard'}
              </div>
              <p className="text-sm text-muted-foreground">Account Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'addresses' ? 'default' : 'outline'}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Addresses
          </Button>
          <Button
            variant={activeTab === 'loyalty' ? 'default' : 'outline'}
            onClick={() => setActiveTab('loyalty')}
          >
            <Star className="h-4 w-4 mr-2" />
            Loyalty
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Button asChild>
                <Link href="/menu">Order Again</Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button asChild>
                    <Link href="/menu">Browse Menu</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {getStatusIcon(order.status || 'pending')}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{order.order_number}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                order.status || 'pending'
                              )}`}
                            >
                              {order.status?.replace('_', ' ') || 'pending'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.created_at &&
                              format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                          </p>
                          <p className="text-sm mt-1">
                            {order.order_items.length} items •{' '}
                            <span className="capitalize">{order.order_type}</span> •{' '}
                            <span className="capitalize">{order.order_day}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">${order.total.toFixed(2)}</span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}/confirmation`}>View Details</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {order.order_items.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted rounded text-sm"
                          >
                            {item.quantity}x {item.item_name}
                          </span>
                        ))}
                        {order.order_items.length > 3 && (
                          <span className="px-2 py-1 text-sm text-muted-foreground">
                            +{order.order_items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                {!isEditingProfile && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={profileForm.full_name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input value={customer.email || ''} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium">{customer.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-medium">{customer.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Member Since</label>
                    <p className="font-medium">
                      {customer.created_at &&
                        format(new Date(customer.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Button onClick={() => setIsAddingAddress(true)} disabled={isAddingAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            {isAddingAddress && (
              <Card className="border-emerald">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Label (e.g., Home, Work)"
                      value={newAddress.address_type}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address_type: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Street Address"
                      value={newAddress.street_address}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street_address: e.target.value })
                      }
                    />
                    <Input
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                    <Input
                      placeholder="ZIP Code"
                      value={newAddress.zip_code}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, zip_code: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddAddress}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddress({
                          address_type: '',
                          street_address: '',
                          city: '',
                          state: 'GA',
                          zip_code: '',
                        });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {addresses.length === 0 && !isAddingAddress ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No saved addresses</p>
                </CardContent>
              </Card>
            ) : (
              addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{address.address_type || 'Address'}</span>
                          {address.is_default && (
                            <span className="px-2 py-0.5 bg-emerald/10 text-emerald text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {address.street_address}
                          <br />
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">Your Loyalty Points</h3>
                    <p className="text-amber-600 text-sm">Earn points on every order!</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-amber-700">
                      {customer.loyalty_points || 0}
                    </div>
                    <p className="text-amber-600 text-sm">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="h-6 w-6 text-emerald" />
                    </div>
                    <h4 className="font-semibold">Order Food</h4>
                    <p className="text-sm text-muted-foreground">
                      Place orders from our delicious menu
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <h4 className="font-semibold">Earn Points</h4>
                    <p className="text-sm text-muted-foreground">
                      Get 1 point for every $1 spent
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">$</span>
                    </div>
                    <h4 className="font-semibold">Redeem Rewards</h4>
                    <p className="text-sm text-muted-foreground">
                      100 points = $5 off your order
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loyaltyTransactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No loyalty activity yet. Start ordering to earn points!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {loyaltyTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.transaction_type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.created_at &&
                              format(new Date(transaction.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <span
                          className={`font-bold ${
                            transaction.points_change > 0 ? 'text-emerald' : 'text-red-500'
                          }`}
                        >
                          {transaction.points_change > 0 ? '+' : ''}
                          {transaction.points_change}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
