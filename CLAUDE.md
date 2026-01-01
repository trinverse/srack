# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Production build (outputs to /out for static hosting)
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 14 App Router website for The Spice Rack Atlanta catering business.

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page
│   ├── menu/               # Menu pages (overview, monday, thursday)
│   ├── catering/           # Catering inquiry page
│   ├── how-it-works/       # Process explanation
│   ├── faq/                # FAQ with accordion
│   └── contact/            # Contact form
├── components/
│   ├── ui/                 # shadcn/ui components (button, card, accordion, etc.)
│   ├── layout/             # Header, Footer
│   └── sections/           # Page sections (Hero, Features, etc.)
├── data/                   # Static data (menu items, FAQs, site config)
├── lib/                    # Utilities (cn function)
└── types/                  # TypeScript interfaces
```

## Tech Stack

- **Framework**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: GitHub Pages (static export)

## Design System

Brand colors defined in `src/app/globals.css`:
- Primary: Deep Emerald `#0A7B5C`
- Accent: Warm Gold `#D4A853`
- Spice: `#C45B28`

## Data Layer

Content is managed via TypeScript files in `/src/data/`:
- `site.ts` - Navigation, contact info, features
- `menu.ts` - Menu items, weekly menus
- `faq.ts` - FAQ items, catering tiers, testimonials

## GitHub Pages Deployment

The site auto-deploys to GitHub Pages on push to main via `.github/workflows/deploy.yml`.
The `basePath` in `next.config.ts` is set to `/srack` for GitHub Pages.

## Future Enhancements

When adding database/payment support:
1. Move to Vercel for full Next.js features
2. Add Supabase for menu management and orders
3. Integrate Stripe for payments
4. Add NextAuth.js for customer accounts
