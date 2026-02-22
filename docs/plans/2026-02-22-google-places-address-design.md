# Google Places Address Autocomplete

## Problem

The checkout address form has 9 manual fields. Users should be able to type an address and select from Google Places autocomplete instead.

## Design

### Flow

1. User clicks "Add New Address" → sees a single Google Places autocomplete input
2. User types, picks an address from the dropdown
3. Google returns structured components → auto-fill street, city, state, zip
4. ZIP is validated against `delivery_zones` table — error if not in service area
5. If valid, expand to show optional fields: Apt/Unit #, Gate Code, Delivery Notes
6. User saves

### Technical

- **Package**: `@googlemaps/js-api-loader` (official Google loader)
- **API**: Places API (New) — Autocomplete widget
- **Env var**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (client-side, HTTP referrer restricted)
- **Autocomplete config**: US addresses only, biased toward Atlanta (lat/lng)
- **Database**: No schema changes — maps to existing `customer_addresses` columns

### Component Structure

- `src/components/google-places-autocomplete.tsx` — reusable autocomplete input component
  - Loads Google Maps JS API via `@googlemaps/js-api-loader`
  - Renders a text input with Places autocomplete attached
  - Calls `onPlaceSelected(place)` callback with parsed address components

### Address Parsing

Google Place → DB columns mapping:
- `street_number` + `route` → `street_address`
- `locality` → `city`
- `administrative_area_level_1` → `state`
- `postal_code` → `zip_code`

### Checkout Integration

Replace the 9-field form in checkout with:
1. Google Places autocomplete input
2. On selection: validate ZIP, show error or expand extras
3. Optional fields: Apt/Unit # (`apartment_number`), Gate Code (`gate_code`), Delivery Notes (`delivery_notes`)
4. Merge old "parking instructions" into delivery notes placeholder text

### Validation

- ZIP must exist in `delivery_zones` table with `is_active = true`
- Validation runs automatically after address selection
- If invalid: show error, let user try a different address
