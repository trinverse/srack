'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

type CheckResult = 'idle' | 'loading' | 'available' | 'unavailable';

export function DeliveryZoneChecker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState<CheckResult>('idle');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  const checkDeliveryZone = async () => {
    if (!zipCode || zipCode.length !== 5) {
      return;
    }

    setResult('loading');
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('zip_code, delivery_fee, is_active')
        .eq('zip_code', zipCode)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setResult('unavailable');
        setDeliveryFee(null);
      } else {
        setResult('available');
        setDeliveryFee(data.delivery_fee);
      }
    } catch {
      setResult('unavailable');
      setDeliveryFee(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDeliveryZone();
    }
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
            Enter your ZIP code to check if we deliver to your area
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <div className="relative flex-1 w-full">
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
                className="w-full px-4 py-3 text-lg text-center border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald bg-background"
              />
            </div>
            <Button
              onClick={checkDeliveryZone}
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

          {/* Result Messages */}
          {result === 'available' && (
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
                <a href="/menu">View Our Menu</a>
              </Button>
            </div>
          )}

          {result === 'unavailable' && (
            <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-center gap-3 text-destructive">
                <XCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Sorry, we don&apos;t deliver to this area yet</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                But don&apos;t worry! You can still pick up your order from one of our convenient locations.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="/pickup-locations">View Pickup Locations</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
