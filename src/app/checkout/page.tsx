'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Truck,
  Store,
  Clock,
  Calendar,
  Gift,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { PickupLocation, CustomerAddress, OrderDay, OrderType } from '@/types/database';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart, setOrderDay } = useCart();
  const { user, customer } = useAuth();
  const supabase = createClient();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [orderDay, setOrderDayState] = useState<OrderDay>('monday');
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>('');
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isGift, setIsGift] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ name: '', phone: '', notes: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ amount: number; code: string } | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // New address form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    apartment_number: '',
    building_name: '',
    city: 'Atlanta',
    state: 'GA',
    zip_code: '',
    gate_code: '',
    parking_instructions: '',
    delivery_notes: '',
  });
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadData = async () => {
    setIsLoading(true);

    // Load pickup locations
    const { data: locations } = await supabase
      .from('pickup_locations')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (locations) {
      setPickupLocations(locations);
    }

    // Load customer addresses
    if (customer) {
      const { data: addrs } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customer.id)
        .eq('address_type', 'shipping');

      if (addrs) {
        setAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        }
      }
    }

    setIsLoading(false);
  };

  const validateZipCode = async (zip: string) => {
    const { data } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('zip_code', zip)
      .eq('is_active', true)
      .single();

    return !!data;
  };

  const handleAddAddress = async () => {
    setZipError('');

    if (!newAddress.zip_code || newAddress.zip_code.length !== 5) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return;
    }

    const isValid = await validateZipCode(newAddress.zip_code);
    if (!isValid) {
      setZipError('Sorry, we do not deliver to this ZIP code. Please choose pickup instead.');
      return;
    }

    if (!customer) return;

    const { data, error } = await supabase.from('customer_addresses').insert({
      customer_id: customer.id,
      address_type: 'shipping',
      ...newAddress,
      is_default: addresses.length === 0,
    }).select().single();

    if (error) {
      setError('Failed to save address');
      return;
    }

    if (data) {
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowNewAddressForm(false);
      setNewAddress({
        street_address: '',
        apartment_number: '',
        building_name: '',
        city: 'Atlanta',
        state: 'GA',
        zip_code: '',
        gate_code: '',
        parking_instructions: '',
        delivery_notes: '',
      });
    }
  };

  const applyDiscountCode = async () => {
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', discountCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!data) {
      setError('Invalid or expired discount code');
      return;
    }

    if (data.minimum_order_amount && state.subtotal < data.minimum_order_amount) {
      setError(`Minimum order of $${data.minimum_order_amount} required for this code`);
      return;
    }

    let discountAmount = 0;
    if (data.discount_type === 'percentage') {
      discountAmount = state.subtotal * (data.discount_value / 100);
    } else if (data.discount_type === 'fixed') {
      discountAmount = data.discount_value;
    }

    setDiscountApplied({ amount: discountAmount, code: data.code });
    setError('');
  };

  const handlePlaceOrder = async () => {
    if (!customer) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Build the payload — only send item IDs, sizes, quantities
      // The server will fetch real prices from the database
      const payload = {
        items: state.items.map((item) => ({
          menu_item_id: item.menuItem.id,
          size: item.size,
          quantity: item.quantity,
        })),
        order_type: orderType,
        order_day: orderDay,
        address_id: orderType === 'delivery' ? selectedAddress : undefined,
        pickup_location_id: orderType === 'pickup' ? selectedPickupLocation : undefined,
        is_gift: isGift,
        recipient_name: isGift ? giftDetails.name : undefined,
        recipient_phone: isGift ? giftDetails.phone : undefined,
        recipient_notes: isGift ? giftDetails.notes : undefined,
        discount_code: discountApplied?.code || undefined,
        agreed_to_terms: agreedToTerms,
      };

      const res = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      // Clear cart and redirect to success
      clearCart();
      router.push(`/orders/${result.order_id}/confirmation`);
    } catch (err: unknown) {
      console.error('Order error:', err);
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  if (!user || state.isLoading || isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="pt-20">
        <section className="py-16">
          <div className="container-wide text-center max-w-lg mx-auto">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out.
            </p>
            <Button asChild>
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const taxRate = 0.08;
  const tax = state.subtotal * taxRate;
  const discountAmount = discountApplied?.amount || 0;
  const total = state.subtotal + tax - discountAmount;

  return (
    <div className="pt-20">
      <section className="py-8">
        <div className="container-wide">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-sm">
                      1
                    </span>
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Day Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setOrderDayState('monday');
                        setOrderDay('monday');
                      }}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        orderDay === 'monday'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-border hover:border-emerald/50'
                      )}
                    >
                      <Calendar className="h-5 w-5 mb-2 text-emerald" />
                      <div className="font-semibold">Monday</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Order by Sun 12 PM
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setOrderDayState('thursday');
                        setOrderDay('thursday');
                      }}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        orderDay === 'thursday'
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/50'
                      )}
                    >
                      <Calendar className="h-5 w-5 mb-2 text-gold" />
                      <div className="font-semibold">Thursday</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Order by Wed 12 PM
                      </div>
                    </button>
                  </div>

                  {/* Delivery vs Pickup */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        orderType === 'delivery'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-border hover:border-emerald/50'
                      )}
                    >
                      <Truck className="h-5 w-5 mb-2 text-emerald" />
                      <div className="font-semibold">Delivery</div>
                      <div className="text-sm text-muted-foreground">
                        To your door
                      </div>
                    </button>
                    <button
                      onClick={() => setOrderType('pickup')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        orderType === 'pickup'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-border hover:border-emerald/50'
                      )}
                    >
                      <Store className="h-5 w-5 mb-2 text-emerald" />
                      <div className="font-semibold">Pickup</div>
                      <div className="text-sm text-muted-foreground">
                        From a location
                      </div>
                    </button>
                  </div>

                  {/* Pickup Location Selection */}
                  {orderType === 'pickup' && (
                    <div className="space-y-3 pt-4 border-t">
                      <label className="font-medium">Select Pickup Location</label>
                      {pickupLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => setSelectedPickupLocation(location.id)}
                          className={cn(
                            'w-full p-4 rounded-lg border text-left transition-colors',
                            selectedPickupLocation === location.id
                              ? 'border-emerald bg-emerald/5'
                              : 'border-border hover:border-emerald/50'
                          )}
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.address}, {location.city}, {location.state}
                          </div>
                          {location.pickup_time && (
                            <div className="text-sm text-emerald mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {location.pickup_time}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Address (for delivery) */}
              {orderType === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-sm">
                        2
                      </span>
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing Addresses */}
                    {addresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={cn(
                          'w-full p-4 rounded-lg border text-left transition-colors',
                          selectedAddress === address.id
                            ? 'border-emerald bg-emerald/5'
                            : 'border-border hover:border-emerald/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-emerald flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium">
                              {address.street_address}
                              {address.apartment_number && `, ${address.apartment_number}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zip_code}
                            </div>
                            {address.building_name && (
                              <div className="text-sm text-muted-foreground">
                                {address.building_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* New Address Form */}
                    {showNewAddressForm ? (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium">Add New Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={newAddress.street_address}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, street_address: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="123 Main St"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Apt/Unit #
                            </label>
                            <input
                              type="text"
                              value={newAddress.apartment_number}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, apartment_number: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="Apt 4B"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Building Name
                            </label>
                            <input
                              type="text"
                              value={newAddress.building_name}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, building_name: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="The Heights"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, city: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">State</label>
                            <input
                              type="text"
                              value={newAddress.state}
                              className="w-full px-3 py-2 border rounded-lg bg-muted"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                            <input
                              type="text"
                              value={newAddress.zip_code}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  zip_code: e.target.value.replace(/\D/g, '').slice(0, 5),
                                })
                              }
                              className={cn(
                                'w-full px-3 py-2 border rounded-lg',
                                zipError && 'border-destructive'
                              )}
                              placeholder="30303"
                              required
                            />
                            {zipError && (
                              <p className="text-sm text-destructive mt-1">{zipError}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Gate Code</label>
                            <input
                              type="text"
                              value={newAddress.gate_code}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, gate_code: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="#1234"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Parking Instructions
                            </label>
                            <input
                              type="text"
                              value={newAddress.parking_instructions}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  parking_instructions: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              placeholder="Park in visitor lot"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Delivery Notes
                            </label>
                            <textarea
                              value={newAddress.delivery_notes}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, delivery_notes: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              rows={2}
                              placeholder="Leave with concierge, ring doorbell, etc."
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddAddress}>Save Address</Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowNewAddressForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowNewAddressForm(true)}
                        className="w-full"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Gift Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-gold" />
                    Ordering for Someone Else?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span>This is a gift or I&apos;m ordering for someone else</span>
                  </label>

                  {isGift && (
                    <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          value={giftDetails.name}
                          onChange={(e) =>
                            setGiftDetails({ ...giftDetails, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Recipient Phone *
                        </label>
                        <input
                          type="tel"
                          value={giftDetails.phone}
                          onChange={(e) =>
                            setGiftDetails({ ...giftDetails, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                          value={giftDetails.notes}
                          onChange={(e) =>
                            setGiftDetails({ ...giftDetails, notes: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={2}
                          placeholder="Any special instructions for the recipient"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms Agreement */}
              <Card>
                <CardContent className="pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 mt-0.5"
                    />
                    <span className="text-sm">
                      {orderType === 'delivery' ? (
                        <>
                          I understand that delivery requires me to be available to receive my
                          order, and I confirm that all provided information is correct.
                        </>
                      ) : (
                        <>
                          I agree to pick up my order on time at the selected location and take
                          responsibility for arriving at the correct pickup point.
                        </>
                      )}
                    </span>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                          {item.size && ` (${item.size})`}
                        </span>
                        <span>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${state.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-emerald">
                        <span>Discount ({discountApplied.code})</span>
                        <span>-${discountApplied.amount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Discount Code */}
                  {!discountApplied && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium mb-2">Discount Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          placeholder="Enter code"
                        />
                        <Button variant="outline" size="sm" onClick={applyDiscountCode}>
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-emerald">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={
                      isSubmitting ||
                      !agreedToTerms ||
                      (orderType === 'delivery' && !selectedAddress) ||
                      (orderType === 'pickup' && !selectedPickupLocation) ||
                      (isGift && (!giftDetails.name || !giftDetails.phone))
                    }
                    onClick={handlePlaceOrder}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Payment will be collected upon confirmation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
