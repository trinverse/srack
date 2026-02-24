# Google Places Address Autocomplete — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 9-field manual address form in checkout with a Google Places autocomplete input that auto-fills address fields and validates the ZIP against delivery zones.

**Architecture:** A reusable `GooglePlacesAutocomplete` component loads the Google Maps JS API via `@googlemaps/js-api-loader`, attaches Places autocomplete to an input, and returns parsed address components via a callback. The checkout page uses this component and shows optional extras (apt, gate code, notes) after a valid address is selected.

**Tech Stack:** `@googlemaps/js-api-loader`, Google Places API (New), Next.js 16, React 19, Tailwind CSS

---

### Task 1: Install `@googlemaps/js-api-loader`

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

Run: `npm install @googlemaps/js-api-loader`

**Step 2: Verify installation**

Run: `node -e "require('@googlemaps/js-api-loader')"`
Expected: No errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @googlemaps/js-api-loader for Places autocomplete"
```

---

### Task 2: Create the GooglePlacesAutocomplete component

**Files:**
- Create: `src/components/google-places-autocomplete.tsx`

**Step 1: Create the component**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, X } from 'lucide-react';

export interface ParsedAddress {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  formatted_address: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelected: (address: ParsedAddress) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

// Singleton loader to avoid re-loading the script
let loaderInstance: Loader | null = null;

function getLoader() {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
    });
  }
  return loaderInstance;
}

function parsePlace(place: google.maps.places.PlaceResult): ParsedAddress | null {
  if (!place.address_components) return null;

  const get = (type: string) =>
    place.address_components?.find((c) => c.types.includes(type))?.short_name || '';

  const streetNumber = get('street_number');
  const route = get('route');
  const city = get('locality') || get('sublocality_level_1');
  const state = get('administrative_area_level_1');
  const zip = get('postal_code');

  if (!route || !city || !state || !zip) return null;

  return {
    street_address: streetNumber ? `${streetNumber} ${route}` : route,
    city,
    state,
    zip_code: zip,
    formatted_address: place.formatted_address || '',
  };
}

export function GooglePlacesAutocomplete({
  onPlaceSelected,
  onClear,
  placeholder = 'Search for your address...',
  className,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = getLoader();

    loader.importLibrary('places').then(() => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address'],
        types: ['address'],
      });

      // Bias results toward Atlanta area
      autocomplete.setBounds(
        new google.maps.LatLngBounds(
          { lat: 33.6, lng: -84.6 }, // SW corner
          { lat: 34.0, lng: -84.2 }  // NE corner
        )
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const parsed = parsePlace(place);
        if (parsed) {
          setValue(parsed.formatted_address);
          onPlaceSelected(parsed);
        }
      });

      autocompleteRef.current = autocomplete;
      setIsLoaded(true);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = () => {
    setValue('');
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isLoaded ? placeholder : 'Loading...'}
        disabled={!isLoaded}
        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald bg-background ${className || ''}`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -5`
Expected: No errors (or only pre-existing ones)

**Step 3: Commit**

```bash
git add src/components/google-places-autocomplete.tsx
git commit -m "feat: add GooglePlacesAutocomplete component"
```

---

### Task 3: Replace the checkout address form

**Files:**
- Modify: `src/app/checkout/page.tsx:50-63` (newAddress state)
- Modify: `src/app/checkout/page.tsx:120-164` (handleAddAddress)
- Modify: `src/app/checkout/page.tsx:481-625` (form UI)

**Step 1: Update the newAddress state**

Replace the `newAddress` state (lines 50-63) with:

```tsx
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<ParsedAddress | null>(null);
  const [newAddress, setNewAddress] = useState({
    apartment_number: '',
    gate_code: '',
    delivery_notes: '',
  });
  const [zipError, setZipError] = useState('');
```

Add the import at the top of the file:

```tsx
import { GooglePlacesAutocomplete, type ParsedAddress } from '@/components/google-places-autocomplete';
```

**Step 2: Update handleAddAddress**

Replace the `handleAddAddress` function with:

```tsx
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
```

**Step 3: Replace the form UI**

Replace the address form section (lines 481-624) with:

```tsx
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
```

**Step 4: Remove unused imports**

Remove `Calendar` and `Clock` from the lucide-react import if no longer used elsewhere in the file. Check first.

**Step 5: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -10`
Expected: No errors

**Step 6: Commit**

```bash
git add src/app/checkout/page.tsx
git commit -m "feat: replace manual address form with Google Places autocomplete"
```

---

### Task 4: Manual test and verify

**Step 1: Add env var**

Ensure `.env.local` has:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your key>
```

**Step 2: Test the flow**

1. Run `npm run dev`
2. Navigate to `/checkout` (must be logged in with items in cart)
3. Click "Add New Address"
4. Type an address — Google autocomplete dropdown should appear
5. Select an address:
   - If ZIP is in delivery zones → see green checkmark + extras fields
   - If ZIP is NOT in delivery zones → see red error message
6. Fill in optional fields and click "Save Address"
7. Address should appear in the address list

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: address form polish after manual testing"
```
