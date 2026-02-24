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
  Banknote,
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
import { GooglePlacesAutocomplete, type ParsedAddress } from '@/components/google-places-autocomplete';
import type { PickupLocation, CustomerAddress, OrderDay, OrderType } from '@/types/database';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const { user, customer, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const orderDay = state.orderDay || 'monday';
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>('');
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isGift, setIsGift] = useState(false);
  const [giftDetails, setGiftDetails] = useState({ name: '', phone: '', notes: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ amount: number; code: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // New address form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<ParsedAddress | null>(null);
  const [newAddress, setNewAddress] = useState({
    apartment_number: '',
    gate_code: '',
    delivery_notes: '',
  });
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) return;

    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, customer, authLoading, router]);

  const loadData = async () => {
    setIsLoading(true);

    try {
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
    } catch (err) {
      console.error('Failed to load checkout data:', err);
    } finally {
      setIsLoading(false);
    }
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

  const handlePlaceSelected = async (place: ParsedAddress) => {
    setZipError('');
    const isValid = await validateZipCode(place.zip_code);
    if (!isValid) {
      setZipError('Sorry, we do not deliver to this ZIP code. Please choose pickup instead.');
      setSelectedPlace(null);
      return;
    }
    setSelectedPlace(place);
  };

  const handleAddAddress = async () => {
    if (!selectedPlace || !customer) return;

    const { data, error } = await supabase.from('customer_addresses').insert({
      customer_id: customer.id,
      address_type: 'shipping',
      street_address: selectedPlace.street_address,
      city: selectedPlace.city,
      state: selectedPlace.state,
      zip_code: selectedPlace.zip_code,
      apartment_number: newAddress.apartment_number || null,
      gate_code: newAddress.gate_code || null,
      delivery_notes: newAddress.delivery_notes || null,
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
      setSelectedPlace(null);
      setNewAddress({ apartment_number: '', gate_code: '', delivery_notes: '' });
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

      // Send order confirmation notification (email + SMS)
      // Fire-and-forget — don't block the redirect on notification delivery
      fetch('/api/notifications/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      }).catch((notifErr) => {
        console.error('Failed to send order confirmation notification:', notifErr);
      });

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

  if (authLoading || !user || state.isLoading || isLoading) {
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
                  {/* Delivery day info - auto-determined from menu items */}
                  <div className="p-3 bg-emerald/5 border border-emerald/20 rounded-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald" />
                    <span className="text-sm font-medium">
                      {orderDay === 'monday' ? 'Monday' : 'Thursday'} Delivery
                    </span>
                    <span className="text-sm text-muted-foreground">
                      &mdash; Order by {orderDay === 'monday' ? 'Sun' : 'Wed'} 12 PM
                    </span>
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

                        <GooglePlacesAutocomplete
                          onPlaceSelected={handlePlaceSelected}
                          onClear={() => {
                            setSelectedPlace(null);
                            setZipError('');
                          }}
                        />

                        {zipError && (
                          <p className="text-sm text-destructive">{zipError}</p>
                        )}

                        {selectedPlace && (
                          <div className="space-y-3 pt-3 border-t">
                            <p className="text-sm text-emerald font-medium">
                              ✓ {selectedPlace.formatted_address}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium mb-1">Apt/Unit #</label>
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
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Delivery Notes</label>
                              <textarea
                                value={newAddress.delivery_notes}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, delivery_notes: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={2}
                                placeholder="Gate code, parking info, leave with concierge, etc."
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button onClick={handleAddAddress} disabled={!selectedPlace}>
                            Save Address
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowNewAddressForm(false);
                              setSelectedPlace(null);
                              setZipError('');
                            }}
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

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-sm">
                      {orderType === 'delivery' ? '3' : '2'}
                    </span>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        paymentMethod === 'cash'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-border hover:border-emerald/50'
                      )}
                    >
                      <Banknote className="h-5 w-5 mb-2 text-emerald" />
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        paymentMethod === 'online'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-border hover:border-emerald/50'
                      )}
                    >
                      <CreditCard className="h-5 w-5 mb-2 text-emerald" />
                      <div className="font-semibold">Pay Online</div>
                      <div className="text-sm text-muted-foreground">
                        Coming soon
                      </div>
                    </button>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Please have the exact amount ready at the time of {orderType === 'delivery' ? 'delivery' : 'pickup'}. Total: <strong>${total.toFixed(2)}</strong>
                      </p>
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
                        {paymentMethod === 'cash' ? (
                          <Banknote className="mr-2 h-4 w-4" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        Place Order{paymentMethod === 'cash' ? ' — Cash on Delivery' : ''}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {paymentMethod === 'cash'
                      ? 'Pay with cash when your order arrives'
                      : 'Payment will be collected upon confirmation'}
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
