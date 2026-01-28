# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a full-stack Next.js 16 App Router application for The Spice Rack Atlanta, a tiffin service and catering business. The application is transitioning from a static site to a full-stack platform with authentication, cart management, and order processing.

### Current State

The application has two deployment modes controlled by `next.config.ts`:
1. **Full-stack mode** (current): Uses Supabase for backend, supports authentication and dynamic features
2. **Static export mode** (legacy): GitHub Pages deployment with `basePath: '/srack'`

### Tech Stack

- **Framework**: Next.js 16 with App Router, TypeScript, React 19
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context API (AuthProvider, CartProvider)
- **Deployment**: Configured for both Vercel/dynamic hosting and GitHub Pages static export

## Key Architecture Patterns

### Database-First Design

The entire data model is defined in `src/types/database.ts` (auto-generated from Supabase). This single source of truth includes:
- All table types (customers, orders, menu_items, cart_items, etc.)
- Enum types (order_day, order_status, user_role, dietary_tag, etc.)
- Helper type exports for common entities

### Authentication Flow

Authentication uses Supabase Auth with a dual-record system:
1. Supabase Auth creates `auth_user_id` (handled by Supabase)
2. Customer record in `customers` table references `auth_user_id`
3. `AuthContext` (`src/context/auth-context.tsx`) manages both user and customer state
4. Middleware (`src/middleware.ts`) protects routes:
   - `/account`, `/checkout`, `/orders` require authentication
   - `/admin` requires admin/kitchen/marketing role

### Cart Management

Cart state is managed in `CartContext` (`src/context/cart-context.tsx`):
- Stored in localStorage as `spice-rack-cart`
- Supports variable sizing (8oz/16oz for curries, single price for rice/roti)
- Calculates subtotals, item counts, and enforces $30 minimum order
- Cart items include full menu item details (not just IDs) for offline functionality

### Component Organization

- `src/components/ui/` - shadcn/ui primitives (Button, Dialog, Input, etc.)
- `src/components/layout/` - Header, Footer with navigation
- `src/components/sections/` - Landing page sections (Hero, Features, Testimonials, etc.)
- `src/components/` - Feature components (EmailPopup, OrderDeadlineBanner, DeliveryZoneChecker)

### Data Layer

Static content in `src/data/`:
- `site.ts` - Site configuration, navigation, contact info
- `menu.ts` - Menu items (being migrated to Supabase)
- `faq.ts` - FAQs, testimonials, catering tiers

Dynamic content fetched from Supabase:
- Menu items, weekly menus, orders, customer data

## Environment Variables

Required environment variables (from Supabase integration):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key

These are used in:
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server component client
- `src/lib/supabase/middleware.ts` - Middleware client

## Supabase Integration

### Client Creation

Three client patterns based on context:
1. **Browser**: `createClient()` from `src/lib/supabase/client.ts`
2. **Server Components**: `createClient()` from `src/lib/supabase/server.ts` (async, uses cookies)
3. **Middleware**: `createServerClient()` in `src/lib/supabase/middleware.ts`

### Database Schema

Key tables (see `src/types/database.ts` for full schema):
- `customers` - User profiles with role-based access (admin, kitchen, marketing, customer)
- `menu_items` - Master menu with categories, dietary tags, sizing options, pricing
- `weekly_menus` - Weekly menu availability by order_day (monday/thursday)
- `orders` - Orders with delivery/pickup details, payment status, order lifecycle
- `order_items` - Line items for orders
- `carts` - Server-side cart storage (currently using localStorage client-side)
- `pickup_locations` - Dynamic pickup locations with driver info
- `delivery_zones` - ZIP code validation and delivery fees
- `discount_codes` - Promotional codes with usage limits
- `audit_logs` - Change tracking for compliance

## Design System

Brand colors defined in `src/app/globals.css`:
- Primary: Deep Emerald `#0A7B5C`
- Accent: Warm Gold `#D4A853`
- Spice: `#C45B28`

Typography uses Inter (body) and Geist Mono (code), configured via `next/font/google`.

## Deployment Notes

### Static Export (GitHub Pages)

To enable static export, uncomment in `next.config.ts`:
```typescript
output: 'export',
basePath: '/srack',
```

This disables server-side features (auth, dynamic routes, API routes).

### Full-Stack Deployment

Current configuration supports:
- Vercel (recommended, zero-config)
- Any Node.js host
- Docker deployment

Note: Image optimization requires a server or `unoptimized: true` for static export.

## PRD Context

The full requirements document is in `prd.txt` (223 lines). Key business requirements:
- Bi-weekly menu (Monday/Thursday delivery schedule)
- $30 minimum order requirement
- Variable pricing (8oz/16oz for entrees/dal, single price for rice/roti)
- Role-based admin dashboard (future)
- Loyalty points system (future)
- Subscription management (future)
- Order deadline enforcement (orders due by noon before delivery day)
- Delivery zone validation by ZIP code
- Pickup location management with driver details
- Email/SMS automation for order lifecycle
