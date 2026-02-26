# Tasks

## Shopify → Next.js Look & Feel Migration

### Phase 1 — Homepage Alignment
- [x] **1.1 Update hero section** — Changed headline to "TIFFIN-DABBA & CATERING SERVICES" / "SPICE UP YOUR DAY WITH AUTHENTIC INDIAN MEALS", CTAs now link to Monday Menu & Thursday Menu
- [x] **1.2 Add Monday/Thursday menu cards** — Added MenuDayCards component with two side-by-side delivery day cards with "Order 36 Hours In Advance" + "Order Now" buttons
- [x] **1.3 Update How It Works to 4 steps** — Updated to 4 steps: Order Online → We Cook For You → We Deliver To You → Quick Heat Meals (with matching icons)
- [x] **1.4 Add WhatsApp community CTA** — Added WhatsAppCTA component with WhatsApp link and messaging
- [x] **1.5 Update About/quality section on homepage** — Changed Features section to "True Indian Cuisine, Crafted with Tradition" with emoji bullet list

### Phase 2 — About Page
- [x] **2.1 Update founding year** — Changed "Since 2020" to "Since 2014" on about page
- [x] **2.2 Align About page copy** — Updated hero text, "What Sets Us Apart" section with Shopify content (freshly cooked, no frozen, no artificial, mindful cooking)

### Phase 3 — FAQ Page
- [x] **3.1 Add missing FAQ categories** — Added Subscription (Curry Club) with 4 Q&As and Account Management with 3 Q&As
- [x] **3.2 Add pickup locations to FAQ** — Added 6 pickup locations with addresses and times to delivery FAQ
- [x] **3.3 Add topic filter** — Added pill-button topic filter matching Shopify's filter UX

### Phase 4 — How It Works Page
- [x] **4.1 Restructure to 5 steps** — Rewrote to 5 detailed steps matching Shopify: Order on Schedule → Fresh Menu → Customize Meal ($30 min, 36hr advance, WhatsApp) → Delivery or Pickup (4-8 PM, fees) → Pay & Enjoy
- [x] **4.2 Update visual layout** — Zigzag layout with numbered circles, icons, and vertical connectors

### Phase 5 — Catering Page
- [x] **5.1 Update pricing model** — Changed from per-person tier packages to tray-based pricing (Small, Medium, Large trays)
- [x] **5.2 Add event types** — Added list of Indian-specific events (Sangeet, Mehndi, Pujas, Garba, Birthdays, etc.)
- [x] **5.3 Add catering PDF download** — Added downloadable catering menu PDF link
- [x] **5.4 Add consultant contact** — Added catering consultant Shreena at (815) 531-9007

### Phase 6 — Footer & Global
- [x] **6.1 Add newsletter signup to footer** — Added "Sign Up for Curry Club" email signup in footer
- [x] **6.2 Add payment method icons** — Added Visa, Mastercard, Amex, Apple Pay labels to footer
- [x] **6.3 Restructure footer columns** — Matched Shopify: Information, Shop, Customer Service, Curry Club signup
- [x] **6.4 Update contact info** — Changed phone to (910) 703-5199 and email to spicerackatlanta@gmail.com

### Phase 7 — Contact Page
- [x] **7.1 Update contact form** — Replaced subject dropdown with phone (optional) field to match Shopify form

### Phase 8 — Header
- [x] **8.1 Remove animated app bar** — Replaced hover-to-reveal nav with always-visible navigation bar showing all links

### Phase 9 — Product Images (Manual Step)
- [ ] **9.1 Download Shopify product images** — Save all product images from the Shopify storefront to use in the Next.js app

#### Instructions:
1. Open **https://the-spice-rack-atlanta-2.myshopify.com/collections/monday-menu** (enter store password if prompted)
2. Right-click each product image → **Save Image As**
3. Save all images into: `public/menu-images/shopify/`
4. Use these filenames (kebab-case, matching product name):

| Shopify Product | Save As |
|---|---|
| Soya Chunk Chole Curry | `soya-chunk-chole-curry.jpg` |
| Dhaba Paneer Masala | `dhaba-paneer-masala.jpg` |
| Palak Pakora Kadhi (V) | `palak-pakora-kadhi.jpg` |
| Cabbage Matar Poriyal | `cabbage-matar-poriyal.jpg` |
| Chicken Vindaloo | `chicken-vindaloo.jpg` |
| Chicken Makhni | `chicken-makhni.jpg` |
| Whole Masoor Daal | `whole-masoor-daal.jpg` |
| Moringa Stick Daal | `moringa-stick-daal.jpg` |
| Plain Roties (Pack of 10) | `plain-roties.jpg` |
| Matar Rice (16oz) | `matar-rice.jpg` |
| Jeera Rice (16oz) | `jeera-rice.jpg` |
| Kodo Millet Veg Pulao w/ Raita | `kodo-millet-veg-pulao.jpg` |
| Mango Rice Kheer (16oz) | `mango-rice-kheer.jpg` |
| Paneer Veg Bread Vada w/chutneys | `paneer-veg-bread-vada.jpg` |

5. Also check **https://the-spice-rack-atlanta-2.myshopify.com/collections/thursday-menu** — if any Thursday items have different images, save those too with the same naming pattern.

6. Once images are saved, tell Claude to wire them up — it will:
   - Add overrides in `src/lib/image-matcher.ts` to prefer the `shopify/` subfolder images
   - Regenerate the image manifest
   - Verify all items have correct images
