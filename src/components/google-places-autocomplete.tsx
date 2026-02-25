'use client';

import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
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

let optionsSet = false;

function ensureOptions() {
  if (!optionsSet) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      v: 'weekly',
      libraries: ['places'],
    });
    optionsSet = true;
  }
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
    ensureOptions();

    importLibrary('places').then(() => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address'],
        types: ['address'],
      });

      autocomplete.setBounds(
        new google.maps.LatLngBounds(
          { lat: 33.6, lng: -84.6 },
          { lat: 34.0, lng: -84.2 }
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
        placeholder={placeholder}
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
