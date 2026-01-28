# The Spice Rack Atlanta - Product Requirements Document

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Frontend Requirements](#frontend-requirements)
3. [Backend Requirements](#backend-requirements)
4. [Customer Journey](#customer-journey)
5. [Technical Requirements](#technical-requirements)
6. [Future Enhancements](#future-enhancements)
7. [Implementation Phases](#implementation-phases)

---

## Executive Summary

The Spice Rack Atlanta is a tiffin (Indian meal) delivery and pickup service operating in the Atlanta area. The business operates on a weekly schedule:
- **Monday orders**: Order deadline is Sunday at noon
- **Thursday orders**: Order deadline is Wednesday at noon

**Minimum order value**: $30.00 (before taxes and delivery fees)

**Brand Colors**: Based on logo colors (Deep Emerald #0A7B5C, Warm Gold #D4A853)

---

## Frontend Requirements

### 1. Landing Page
- Attractive, simple design matching current Shopify site aesthetic
- Brand color scheme from logo
- Fast loading on all devices (mobile, desktop, iOS, Android)
- High-speed performance across all platforms

### 2. Navigation Structure
| Tab | Description |
|-----|-------------|
| Tiffin Menu | Weekly menu display with Monday/Thursday options |
| How It Works | Step-by-step ordering process explanation |
| FAQs | Frequently asked questions |
| About Us | Brand story and company information |
| Contact | Contact information and support |
| Party Catering | Catering services and inquiry |

### 3. Delivery Zone Checker
- Prominent section: "Let's check if we deliver to your home"
- ZIP code/address input field
- Real-time validation against delivery zones
- If out of zone: Guide to pickup options
- Reference: Similar to Dabba Wala's site implementation

### 4. Content Migration
- All existing Shopify content must be migrated accurately:
  - FAQs
  - How It Works
  - Policies
  - About Us
  - Contact information

### 5. Future Frontend Features
- [ ] Animated video explanations highlighting brand history
- [ ] Animated "How It Works" video

---

## Backend Requirements

### 1. Menu Management System

#### 1.1 Master Menu Database
| Field | Description | Required |
|-------|-------------|----------|
| Item ID | Unique identifier | Yes |
| Name | Menu item name | Yes |
| Description | Detailed description | Yes |
| Picture | High-quality image | Yes |
| Category | One of 5 categories (see below) | Yes |
| Dietary Tags | Multiple tags allowed | Yes |
| Spice Level | Hot/Medium/Mild | No |
| Size Options | 8oz/16oz or single price | Yes |
| Price(s) | Variable pricing by size | Yes |
| Status | Active/Inactive | Yes |

#### 1.2 Menu Categories
1. **Veg Entrees**
2. **Non-Veg Entrees**
3. **Dal Entrees**
4. **Roties & Rice**
5. **Special Items**

#### 1.3 Dietary Tags
- Vegetarian (Veg)
- Non-Vegetarian (Non-Veg)
- Vegan
- Gluten-Free
- Hot
- Medium
- Mild

#### 1.4 Pricing Structure
| Category Type | Pricing Model |
|---------------|---------------|
| Veg Curries | Variable (8oz / 16oz) |
| Non-Veg Curries | Variable (8oz / 16oz) |
| Daal | Variable (8oz / 16oz) |
| Rice | Single price |
| Rotis | Single price |
| Special Items | Single price |

#### 1.5 Menu Operations
- **Day-specific menu assignment**: Assign items to Monday or Thursday menus
- **Pre-fill capability**: Prepare upcoming day's menu without going live
- **Master toggle**: Turn entire menu on/off instantly (toggle button for staff)
- **Item-level toggle**: Enable/disable specific items (e.g., out of stock)
- **CRUD operations**: Create, read, update, delete menu items
- **Quick updates**: Fast editing of prices, pictures, descriptions

#### 1.6 Future Menu Features
- [ ] Student-only special menu accessible by campus/area/zipcode

---

### 2. Customer Order Management

#### 2.1 Required Customer Fields

**Billing Address:**
| Field | Required |
|-------|----------|
| Street Address | Yes |
| Apartment Number | No |
| City | Yes |
| State | Yes |
| ZIP Code | Yes |

**Shipping Address:**
| Field | Required |
|-------|----------|
| Street Address | Yes |
| Apartment Number | No |
| City | Yes |
| State | Yes |
| ZIP Code | Yes |
| Building/Apartment Name | No |
| Gate Code | No |
| Phone Number | Yes |
| Parking Instructions | No |
| Note Section | No |

#### 2.2 "Ordering for Someone Else" Feature
When flag is enabled, require:
- Recipient's full address details
- Recipient's phone number
- Recipient's availability information
- Correct ZIP code validation
- Building information
- Parking instructions
- Delivery meeting point info

#### 2.3 Order Validation
- ZIP code validation against delivery zones
- If out of zone: Redirect to pickup options
- Minimum order value enforcement: $30.00 (before taxes/delivery fees)
- Phone number validation (reject Google Voice/office numbers)

#### 2.4 Customer Agreements
**For Pickup Orders:**
- [ ] Checkbox: "I agree to be available during the pickup window"
- [ ] Checkbox: "I take responsibility for arriving on time at the correct pickup location"

**For Delivery Orders:**
- [ ] Checkbox: "I understand delivery requires me to be available or provide access"
- [ ] Checkbox: "I confirm all provided information is correct"

#### 2.5 Order Editing Capabilities
- Add items to existing order
- Remove items from existing order
- Charge customer for modifications
- Manual order placement (for phone orders / elderly customers)

#### 2.6 Customer Flagging
- VIP flag for frequent customers
- Priority handling for VIP customers

#### 2.7 Customer Profile Management
- Store customer preferences
- Order history tracking
- Address management
- Notes management

#### 2.8 Future Customer Features
- [ ] Subscription management (start/stop/pause)
- [ ] Recurring order handling
- [ ] Full CRM system integration

---

### 3. Delivery and Pickup Management

#### 3.1 Delivery Order Processing
- Automatic CSV file generation for delivery orders
- CSV Format fields:
  - Street/Address
  - Apartment/Floor
  - ZIP Code
  - Customer Name
  - Phone Number
  - Notes

#### 3.2 Pickup Location Management
- Dynamic add/delete pickup locations
- Toggle locations on/off based on driver availability
- Separation of pickup orders by location
- Easy sorting and reporting by location

#### 3.3 Driver Information Management
- Driver phone number
- Car description
- Exact pickup location
- Ability to update based on driver availability

#### 3.4 Pickup Details Integration
- Time
- Location address
- Driver information
- Include in order confirmation emails
- Include in reminder texts/notifications

---

### 4. Order Communication System

#### 4.1 Immediate Notifications
| Event | Email | Text |
|-------|-------|------|
| Order Placed | Yes | Optional |
| Order Declined | Yes | Yes |
| Order Canceled | Yes | Yes |
| Order Changed | Yes | Yes |
| Payment Declined | Yes | Yes |

#### 4.2 Reminder Notifications
| Notification Type | Timing | Method |
|-------------------|--------|--------|
| Delivery Reminder | Few hours before | Text |
| Pickup Reminder | Few hours before | Text |
| Pickup Details | With reminder | Text (time, place, driver info) |

#### 4.3 Order Status Management (Internal)
| Status | Description |
|--------|-------------|
| In-Progress | Order being prepared |
| Hold | Order on hold |
| Ready for Delivery/Pickup | Order completed, awaiting dispatch |
| Completed | Order delivered/picked up |
| Order Canceled | Order canceled |

*Note: Status changes are internal only - no customer notifications*

#### 4.4 Payment Issue Handling
- **Pending Payment**: Notify customer to complete payment
- **Declined Payment**: Alert customer, prompt reattempt
- **Abandoned Cart**: Send reminder email

#### 4.5 Post-Order Communication
- Automated follow-up email/text after delivery/pickup
- Feedback request
- Satisfaction survey

#### 4.6 Issue Reporting
- Notification system for:
  - Missing items
  - Wrong orders
- Policy for immediate reporting

---

### 5. Reporting System

#### 5.1 Kitchen Reports (Highest Priority)

**Product Quantity Report:**
- Printer-friendly format
- Summary of total items ordered
- Breakdown by size (8oz vs 16oz)
- Filter by specific day or date range
- Example: "Total curries to prepare: X (Y 8oz, Z 16oz)"

**Order Receipts:**
- Separate delivery and pickup orders
- Bulk print capability
- Used for order fulfillment

#### 5.2 Label Printing
- Integration with DYMO LabelWriter 4XL
- Print stickers for food containers
- Print customer name labels for bags

#### 5.3 Sales Reports
| Report Type | Frequency | Details |
|-------------|-----------|---------|
| Units Sold | On-demand | By item, by size |
| Sales Trends | Weekly/Monthly | Popular items, revenue |
| Inventory Planning | On-demand | Stock requirements |

#### 5.4 Report Export
- PDF format
- Excel format
- Shareable with team/suppliers

---

### 6. Admin Controls

#### 6.1 Customer Management
- Edit customer profile information
- Update addresses
- Correct ZIP codes
- Add/edit notes
- Manual order updates

#### 6.2 Order Control
- Start/stop taking orders (toggle on/off)
- Manage multiple pickup locations
- Toggle locations on/off

#### 6.3 Discount System
| Feature | Description |
|---------|-------------|
| Discount Codes | Create codes for products/promotions |
| Event Discounts | Special event codes |
| Conditional Discounts | e.g., "Free samosa on orders > $X" |

#### 6.4 Points/Loyalty System
| Setting | Default Value | Configurable |
|---------|---------------|--------------|
| Points Earning | 1 point per $1 spent | Yes |
| Redemption Rate | 20 points = $1 discount | Yes |

#### 6.5 Role-Based Access Control
| Role | Access Level |
|------|--------------|
| Admin | Full system access |
| Kitchen | Order viewing, status updates, reports |
| Marketing | Customer data, promotions, analytics |

#### 6.6 Audit Logging
- Track all changes to orders
- Track all changes to menus
- User accountability
- Timestamp all actions

---

### 7. Automation Features

#### 7.1 Cart Management
- Auto-delete abandoned cart items after 24 hours
- Email notification before deletion
- Reason: Menu changes frequently

#### 7.2 Abandoned Cart Recovery
- Email reminders to encourage order completion
- Text reminders (optional)

#### 7.3 Order Processing Automation
- Receipt printing (auto-sorted by delivery/pickup)
- Pickup location sorting
- CSV file generation for delivery orders
- Integration with delivery company API

#### 7.4 Communication Automation
- Pickup confirmation texts (time, location, driver info)
- Delivery reminder texts

#### 7.5 Label Printing Automation
- Batch processing for stickers/labels
- Time-saving bulk operations

---

### 8. Email Marketing Flows

#### 8.1 Lead Capture
- Email collection pop-up on site

#### 8.2 Email Sequences

| Flow | Trigger | Purpose |
|------|---------|---------|
| Welcome Series | New signup | Brand story, how it works |
| First Purchase | Post first order | Schedule info, expectations |
| Abandoned Cart | Cart abandoned | Recovery reminder |
| Holiday/Season | Seasonal | Special promotions |
| Win-back | No order in X days | "We missed you" re-engagement |

---

## Customer Journey

### Step 1: Welcome Screen
- Brief welcome message
- Sign Up / Log In options
- Special offer banner (e.g., "10% off with code WELCOME")
- Optional 30-second intro video

### Step 2: Account Creation
**Required Fields:**
- Full Name
- Email Address
- Phone Number (validated, no Google Voice)
- Password

**Options:**
- Social sign-up (Google/Facebook)
- Opt-in checkbox for text/email updates
- Terms of Service and Privacy Policy links

### Step 3: Address and Delivery Details
**Billing Address:**
- Street, City, State, ZIP (mandatory)

**Shipping Address:**
- "Same as billing" option
- Full address fields
- Gate code (if applicable)
- Note section for special instructions

**Validation:**
- ZIP code eligibility check
- Google Maps API for address auto-suggest

**Pickup Option:**
- Dropdown with up to 6 locations (admin-toggleable)

### Step 4: Order Preference Setup
**Options:**
- One-Time Order: Starting at $30
- Subscription: Weekly tiffin (Future feature)

**If Subscription Selected (Future):**
- Frequency: Weekly (Monday, Thursday, or both)
- Meal selection: Pre-set combo or custom
- First delivery/pickup date selection

### Step 5: Payment Setup
**Via Authorize.net:**
- Card Number
- Expiration Date
- CVV
- Name on Card
- Save card option (default checked)

**Display:**
- $30 minimum order reminder
- Discount code entry field
- "Won't charge until confirmed" message

### Step 6: Confirmation and Agreement
**Order Summary:**
- Order type (one-time/subscription)
- Delivery/pickup details
- Payment method

**Required Agreements:**
- Pickup: "I agree to pick up on time"
- Delivery: "I understand availability requirements"

**Links:**
- "How It Works" page

### Step 7: First Order Placement
**Redirect to Menu:**
- Display active menu (Monday or Thursday)
- Upsell suggestions
- $30 minimum reminder
- Discount code application
- Tip: "Order 48 hours in advance"

### Step 8: Welcome Confirmation
**Email/Text Content:**
- Welcome message
- Account details summary
- First order details (if placed)
- Manage account link

**Optional:**
- Quick satisfaction survey (1-5 stars)

### UX Enhancements
- Progress bar (Step X of 8)
- Tooltips for explanations
- "Skip" option for subscription setup
- Post-onboarding 3-slide tutorial
- Live chat "Need help?" button

---

## Technical Requirements

### Payment Gateway
- **Provider**: Authorize.net
- **Processor**: Patel Processing
- **Features**: Recurring payments (future), saved cards

### Performance
- High-speed loading across all platforms
- Mobile-optimized
- iOS and Android compatibility

### Hardware Integration
- **Label Printer**: DYMO LabelWriter 4XL
- **Receipt Printer**: Standard thermal printer (printer-friendly outputs)

### External Integrations
- Google Maps API (address validation)
- Delivery company API (CSV integration)
- SMS gateway (text notifications)
- Email service provider

### Database Requirements
- Customer profiles
- Order history
- Menu items
- Pickup locations
- Audit logs
- Discount codes
- Points/loyalty tracking

---

## Future Enhancements

These features are explicitly marked for future implementation:

| Feature | Category | Priority |
|---------|----------|----------|
| Animated video explanations | Frontend | Low |
| Student-only special menu by campus/area/ZIP | Menu | Medium |
| Subscription management system | Orders | High |
| Full CRM system | Customer | Medium |
| App download integration | Mobile | Low |

---

## Implementation Phases

### Phase 1: Foundation (MVP)
1. Frontend website with all pages
2. Delivery zone checker
3. Basic menu display (read-only)
4. Contact forms
5. Content migration from Shopify

### Phase 2: Menu Management
1. Master menu database
2. Admin panel for menu CRUD
3. Day-specific menu assignment
4. Menu toggle controls
5. Dietary tags and categories

### Phase 3: Order System
1. Customer registration/login
2. Address validation
3. Cart functionality with $30 minimum
4. Order placement flow
5. Basic order confirmation emails

### Phase 4: Payment Integration
1. Authorize.net integration
2. Payment processing
3. Discount code system
4. Points/loyalty system foundation

### Phase 5: Operations
1. Order management dashboard
2. Kitchen reports
3. Delivery CSV generation
4. Pickup location management
5. DYMO label printing integration

### Phase 6: Communication
1. Automated email notifications
2. SMS integration
3. Abandoned cart recovery
4. Post-order feedback

### Phase 7: Advanced Features
1. Role-based access control
2. Audit logging
3. VIP customer flagging
4. Manual order entry
5. Order editing capabilities

### Phase 8: Marketing Automation
1. Email pop-up capture
2. Welcome email series
3. Seasonal campaigns
4. Win-back campaigns

### Phase 9: Future Enhancements
1. Subscription system
2. CRM integration
3. Student menu system
4. Video content

---

## Reference

**Current Shopify Site**: https://the-spice-rack-atlanta-2.myshopify.com/
**Password**: poomay

**Competitor Reference**: Dabba Wala (delivery zone checker implementation)

---

## Appendix

### A. CSV Format for Delivery Orders
```
Name,Street Address,Apartment/Floor,City,State,ZIP,Phone,Notes
"John Doe","123 Main St","Apt 4B","Atlanta","GA","30303","404-555-1234","Leave with concierge"
```

### B. Sample Kitchen Report Format
```
===========================================
THE SPICE RACK ATLANTA - KITCHEN REPORT
Date: Monday, March 31, 2025
===========================================

VEG ENTREES
-----------
Paneer Butter Masala (8oz):  12
Paneer Butter Masala (16oz): 8
Palak Paneer (8oz):          6
Palak Paneer (16oz):         4

NON-VEG ENTREES
---------------
Butter Chicken (8oz):        15
Butter Chicken (16oz):       22
Chicken Tikka (8oz):         8
Chicken Tikka (16oz):        10

DAL ENTREES
-----------
Dal Tadka (8oz):             10
Dal Tadka (16oz):            6

ROTIES & RICE
-------------
Basmati Rice:                45
Garlic Naan:                 38
Butter Roti:                 25

SPECIAL ITEMS
-------------
Samosa (2pc):                30
Gulab Jamun:                 15

===========================================
TOTAL ORDERS: 85 (Delivery: 60, Pickup: 25)
===========================================
```

### C. Order Status Flow
```
[New Order] → [In-Progress] → [Ready for Delivery/Pickup] → [Completed]
                    ↓
                 [Hold]
                    ↓
            [Order Canceled]
```

### D. Customer Onboarding Flow
```
Welcome → Account Creation → Address Details → Order Preference → Payment → Confirmation → First Order → Welcome Email
```
