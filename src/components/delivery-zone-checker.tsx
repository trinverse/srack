'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2, Truck, Store, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { GooglePlacesAutocomplete, type ParsedAddress } from '@/components/google-places-autocomplete';
import Link from 'next/link';

type CheckResult = 'idle' | 'loading' | 'delivery' | 'pickup' | 'both' | 'unavailable';

interface NearbyPickup {
  name: string;
  address: string;
  city: string;
  state: string;
  pickup_time: string | null;
}

export function DeliveryZoneChecker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState<CheckResult>('idle');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [nearbyPickups, setNearbyPickups] = useState<NearbyPickup[]>([]);
  const [inputMode, setInputMode] = useState<'address' | 'zip'>('address');

  const hasGoogleApi = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const checkAvailability = async (zip: string) => {
    if (!zip || zip.length !== 5) return;

    setResult('loading');
    const supabase = createClient();

    try {
      // Check delivery zone by ZIP
      const { data: zoneData } = await supabase
        .from('delivery_zones')
        .select('zip_code, delivery_fee, is_active')
        .eq('zip_code', zip)
        .eq('is_active', true)
        .single();

      const deliveryAvailable = !!zoneData;
      if (deliveryAvailable) {
        setDeliveryFee(zoneData.delivery_fee);
      } else {
        setDeliveryFee(null);
      }

      // Check active pickup locations
      const { data: pickups } = await supabase
        .from('pickup_locations')
        .select('name, address, city, state, pickup_time')
        .eq('is_active', true)
        .order('sort_order');

      const availablePickups: NearbyPickup[] = (pickups || []).map((p) => ({
        name: p.name,
        address: p.address,
        city: p.city,
        state: p.state,
        pickup_time: p.pickup_time,
      }));

      setNearbyPickups(availablePickups);

      // Determine result
      if (deliveryAvailable && availablePickups.length > 0) {
        setResult('both');
      } else if (deliveryAvailable) {
        setResult('delivery');
      } else if (availablePickups.length > 0) {
        setResult('pickup');
      } else {
        setResult('unavailable');
      }
    } catch {
      setResult('unavailable');
      setDeliveryFee(null);
      setNearbyPickups([]);
    }
  };

  const handlePlaceSelected = (place: ParsedAddress) => {
    setZipCode(place.zip_code);
    checkAvailability(place.zip_code);
  };

  const handleZipCheck = () => {
    checkAvailability(zipCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleZipCheck();
    }
  };

  const resetCheck = () => {
    setResult('idle');
    setZipCode('');
    setDeliveryFee(null);
    setNearbyPickups([]);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-emerald/5 to-gold/5">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald/10 mb-6">
            <MapPin className="w-8 h-8 text-emerald" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Do We Deliver to You?
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your location or ZIP code to check availability
          </p>

          {/* Toggle between address search and ZIP */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => { setInputMode('address'); resetCheck(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${inputMode === 'address'
                  ? 'bg-emerald text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
            >
              <Navigation className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Search Address
            </button>
            <button
              onClick={() => { setInputMode('zip'); resetCheck(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${inputMode === 'zip'
                  ? 'bg-emerald text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Enter ZIP Code
            </button>
          </div>

          {/* Input area */}
          <div className="max-w-lg mx-auto">
            {inputMode === 'address' && hasGoogleApi ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={handlePlaceSelected}
                onClear={resetCheck}
                placeholder="Enter your address or location..."
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="relative flex-1 w-full">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setZipCode(value);
                      if (result !== 'idle') setResult('idle');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter ZIP code"
                    className="w-full pl-10 pr-4 py-3 text-lg border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald bg-background"
                  />
                </div>
                <Button
                  onClick={handleZipCheck}
                  disabled={zipCode.length !== 5 || result === 'loading'}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {result === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Check Availability'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Loading state for address mode */}
          {result === 'loading' && inputMode === 'address' && (
            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Checking availability...</span>
            </div>
          )}

          {/* Result: Both delivery and pickup available */}
          {result === 'both' && (
            <div className="mt-8 p-6 bg-emerald/10 border border-emerald/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-center gap-3 text-emerald mb-4">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Great news! We serve your area!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Delivery option */}
                <div className="p-4 bg-white/60 dark:bg-white/5 rounded-lg border border-emerald/10">
                  <Truck className="w-5 h-5 text-emerald mx-auto mb-2" />
                  <p className="font-semibold text-sm">Delivery Available</p>
                  {deliveryFee !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {deliveryFee === 0 ? 'Free delivery!' : `Fee: $${deliveryFee.toFixed(2)}`}
                    </p>
                  )}
                </div>

                {/* Pickup option */}
                <div className="p-4 bg-white/60 dark:bg-white/5 rounded-lg border border-emerald/10">
                  <Store className="w-5 h-5 text-emerald mx-auto mb-2" />
                  <p className="font-semibold text-sm">Pickup Available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nearbyPickups.length} location{nearbyPickups.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>

              {/* Show pickup locations */}
              {nearbyPickups.length > 0 && (
                <div className="mt-4 space-y-2">
                  {nearbyPickups.slice(0, 3).map((pickup, i) => (
                    <div key={i} className="text-sm text-left p-3 bg-white/40 dark:bg-white/5 rounded-lg flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{pickup.name}</span>
                        <span className="text-muted-foreground"> — {pickup.address}, {pickup.city}</span>
                        {pickup.pickup_time && (
                          <span className="text-emerald text-xs ml-1">({pickup.pickup_time})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button className="mt-4" asChild>
                <Link href="/menu">View Our Menu</Link>
              </Button>
            </div>
          )}

          {/* Result: Delivery only */}
          {result === 'delivery' && (
            <div className="mt-8 p-6 bg-emerald/10 border border-emerald/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-center gap-3 text-emerald">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Great news! We deliver to your area!</span>
              </div>
              {deliveryFee !== null && deliveryFee > 0 && (
                <p className="mt-2 text-muted-foreground">
                  Delivery fee: ${deliveryFee.toFixed(2)}
                </p>
              )}
              {deliveryFee === 0 && (
                <p className="mt-2 text-muted-foreground">
                  Free delivery to your area!
                </p>
              )}
              <Button className="mt-4" asChild>
                <Link href="/menu">View Our Menu</Link>
              </Button>
            </div>
          )}

          {/* Result: Pickup only (no delivery) */}
          {result === 'pickup' && (
            <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-center gap-3 text-amber-600">
                <Store className="w-6 h-6" />
                <span className="text-lg font-semibold">Pickup available near you!</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                We don&apos;t deliver to this ZIP code yet, but you can pick up from these locations:
              </p>

              {nearbyPickups.length > 0 && (
                <div className="mt-4 space-y-2">
                  {nearbyPickups.slice(0, 3).map((pickup, i) => (
                    <div key={i} className="text-sm text-left p-3 bg-white/60 dark:bg-white/5 rounded-lg flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{pickup.name}</span>
                        <span className="text-muted-foreground"> — {pickup.address}, {pickup.city}</span>
                        {pickup.pickup_time && (
                          <span className="text-amber-600 text-xs ml-1">({pickup.pickup_time})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button className="mt-4" asChild>
                <Link href="/menu">Order for Pickup</Link>
              </Button>
            </div>
          )}

          {/* Result: Nothing available */}
          {result === 'unavailable' && (
            <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-center gap-3 text-destructive">
                <XCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Sorry, we don&apos;t serve this area yet</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                We&apos;re expanding! Check back soon or contact us for catering options.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
