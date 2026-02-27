import { FAQItem, CateringTier, Testimonial } from '@/types';

export const faqItems: FAQItem[] = [
  {
    id: 'how-to-order',
    question: 'How do I place an order?',
    answer:
      'You can place an order through our website. Simply browse our weekly menu, select your items, and checkout. Orders must be placed at least 30 hours before the delivery day.',
    category: 'ordering',
  },
  {
    id: 'delivery-days',
    question: 'What days do you deliver?',
    answer:
      'We deliver on Mondays and Thursdays. Each delivery day has its own menu, allowing us to prepare everything fresh on the day of delivery.',
    category: 'delivery',
  },
  {
    id: 'delivery-areas',
    question: 'What areas do you deliver to?',
    answer:
      'We currently deliver to the Greater Atlanta metro area, including Sandy Springs, Dunwoody, parts of Marietta, and Smyrna. Put in your address to see if we deliver.',
    category: 'delivery',
  },
  {
    id: 'order-deadline',
    question: 'What is the order deadline?',
    answer:
      'Orders must be placed at least 30 hours before the delivery day. For Monday deliveries, order by Sunday 6:00 PM. For Thursday deliveries, order by Wednesday 6:00 PM.',
    category: 'ordering',
  },
  {
    id: 'dietary-restrictions',
    question: 'Can you accommodate dietary restrictions?',
    answer:
      'Yes! Many of our dishes are naturally vegetarian, vegan, or gluten-free. Each menu item is clearly labeled with dietary information. For severe allergies, please contact us directly to discuss your needs.',
    category: 'dietary',
  },
  {
    id: 'spice-levels',
    question: 'Can I adjust the spice level?',
    answer:
      'While we prepare dishes according to traditional recipes, we can accommodate mild preferences. Please note this in your order comments, and we will adjust accordingly.',
    category: 'dietary',
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, and digital payment methods including Apple Pay and Google Pay. Payment is collected at the time of ordering.',
    category: 'payments',
  },
  {
    id: 'cancellation',
    question: 'What is your cancellation policy?',
    answer:
      'Orders can be cancelled up to 24 hours before the delivery day for a full refund. Cancellations within 24 hours of delivery may be subject to a 50% fee as ingredients will have already been purchased.',
    category: 'ordering',
  },
  {
    id: 'reheating',
    question: 'How should I reheat the food?',
    answer:
      'Our meals are delivered ready to eat but can be gently reheated. For best results, use a microwave for 1-2 minutes or warm on the stovetop over medium-low heat. Breads can be refreshed in a hot pan or oven.',
    category: 'ordering',
  },
  {
    id: 'catering-minimum',
    question: 'What is the minimum order for catering?',
    answer:
      'Our catering services start at a minimum of 15 guests. We offer tiered packages for gatherings of all sizes, from intimate dinner parties to large corporate events.',
    category: 'catering',
  },
  // Ordering & Delivery - Pickup Locations
  {
    id: 'pickup-locations',
    question: 'What are your pickup locations?',
    answer:
      '• Costco Sandy Springs — 6350 Peachtree Dunwoody Rd, Atlanta, GA 30328 (5:30 – 6:00 PM)\n• Avenue at East Cobb — 4363 Roswell Road, Marietta, GA 30062 (6:30 – 7:00 PM)\n• Costco Cumberland Mall — 2900 Cumberland Mall, Atlanta, GA 30339 (7:30 – 8:00 PM)\n• Costco Alpharetta — 2855 Jordan Ct, Alpharetta, GA 30004 (5:30 – 6:00 PM)\n• Walmart Cumming — 2395 Peachtree Pkwy, Cumming, GA 30041 (6:30 – 7:00 PM)\n• Desi Plaza Duluth — 2255 Pleasant Hill Rd, Duluth, GA 30096 (7:30 – 8:00 PM)\n• Decatur QT — 1910 Lawrenceville Hwy, Decatur, GA 30033 (3:30 – 4:00 PM)',
    category: 'delivery',
  },
  {
    id: 'delivery-schedule',
    question: 'What is your delivery schedule?',
    answer:
      'Deliveries are made on Mondays and Thursdays between 4:00 PM and 8:00 PM. You can leave a cooler outside if you won\u2019t be home.',
    category: 'delivery',
  },
  {
    id: 'advance-order',
    question: 'Why do you require 30-hour advance orders?',
    answer:
      'Our meals are cooked fresh on the day of delivery. We require 30 hours to source fresh ingredients and complete preparation.',
    category: 'ordering',
  },
  // About Our Tiffin Service
  {
    id: 'what-is-tiffin',
    question: 'What is a Tiffin Service?',
    answer:
      'Tiffin is a flexible meal delivery service providing freshly made, home-style meals without any long-term commitments. Order only when you want\u2014no subscriptions required.',
    category: 'ordering',
  },
  {
    id: 'what-makes-unique',
    question: 'What makes us unique?',
    answer:
      'Unlike traditional tiffin services, we offer a commitment-free model. You decide when to order\u2014no weekly or monthly subscriptions.',
    category: 'ordering',
  },
  {
    id: 'food-preparation',
    question: 'Where is the food prepared?',
    answer:
      'Our meals are prepared in a licensed commercial kitchen by experienced professionals following all FDA guidelines.',
    category: 'ordering',
  },
  // Dietary
  {
    id: 'vegetarian-options',
    question: 'Do you offer vegetarian options?',
    answer:
      'Yes, we provide a range of vegetarian dishes, carefully prepared in separate containers using dedicated utensils to avoid cross-contamination.',
    category: 'dietary',
  },
  {
    id: 'nut-allergies',
    question: 'Do you accommodate nut allergies?',
    answer:
      'We cannot guarantee a nut-free environment as our kitchen processes nuts. We recommend avoiding our service if you have severe nut allergies.',
    category: 'dietary',
  },
  {
    id: 'jain-options',
    question: 'Do you offer Jain (No Onion-Garlic) options?',
    answer:
      'For our weekly meal service, we do not offer Jain options due to bulk cooking. However, we can accommodate Jain preferences for catering orders.',
    category: 'dietary',
  },
  // Payments
  {
    id: 'loyalty-points',
    question: 'How do I use loyalty points?',
    answer:
      'Loyalty points can be redeemed at checkout. Available points and applicable discounts will be displayed.',
    category: 'payments',
  },
  {
    id: 'refunds',
    question: 'How long do refunds take?',
    answer:
      'Refunds are processed within 2\u20133 days and usually appear in your account within 7\u201310 business days.',
    category: 'payments',
  },
  // Subscription Management (Curry Club)
  {
    id: 'curry-club',
    question: 'How does the Curry Club work?',
    answer:
      'Our Curry Club is designed for regular customers who love ordering from us every week — or even twice a week. Members can sign up for a Curry Club membership to enjoy savings on their favorite meals, along with exclusive perks like free delivery and priority ordering.',
    category: 'subscription',
  },
  {
    id: 'pause-subscription',
    question: 'Can I pause my subscription?',
    answer:
      'Yes, you can pause your plan for one week through \u201CMy Account.\u201D To extend the pause, contact us at spicerackatlanta@gmail.com or call (910) 703-5199.',
    category: 'subscription',
  },
  {
    id: 'reactivate-subscription',
    question: 'How do I reactivate my subscription?',
    answer:
      'Go to \u201CMy Account,\u201D select \u201CManage Subscription,\u201D and click \u201CUnpause.\u201D',
    category: 'subscription',
  },
  {
    id: 'subscription-billing',
    question: 'How often will I be charged?',
    answer:
      'Weekly, starting from your first delivery date.',
    category: 'subscription',
  },
  // Account Management
  {
    id: 'change-password',
    question: 'How do I change my password or email?',
    answer:
      'Log into your account, go to \u201CMy Account,\u201D and select \u201CAccount Settings\u201D to update your details.',
    category: 'account',
  },
  {
    id: 'update-address',
    question: 'How do I update my delivery address?',
    answer:
      'Visit \u201CMy Account,\u201D select \u201CAddress Book,\u201D and add or update your address.',
    category: 'account',
  },
  {
    id: 'delivery-instructions',
    question: 'Where do I enter special delivery instructions?',
    answer:
      'Add any gate codes, parking instructions, or special delivery notes in the \u201CNotes\u201D section during checkout.',
    category: 'account',
  },
];

export const cateringTiers: CateringTier[] = [
  {
    id: 'intimate',
    name: 'Intimate Gathering',
    description: 'Perfect for dinner parties and small celebrations',
    minGuests: 15,
    maxGuests: 30,
    pricePerPerson: 25,
    features: [
      '3 main dishes of your choice',
      'Rice and bread selection',
      'Appetizer platter',
      'Dessert',
      'Disposable serving ware',
    ],
  },
  {
    id: 'celebration',
    name: 'Celebration Package',
    description: 'Ideal for birthdays, anniversaries, and family reunions',
    minGuests: 30,
    maxGuests: 75,
    pricePerPerson: 22,
    features: [
      '4 main dishes of your choice',
      'Rice and bread selection',
      '2 appetizer options',
      'Raita and chutneys',
      'Dessert selection',
      'Chafing dishes rental',
      'Disposable serving ware',
    ],
  },
  {
    id: 'grand',
    name: 'Grand Affair',
    description: 'For weddings, corporate events, and large gatherings',
    minGuests: 75,
    maxGuests: 200,
    pricePerPerson: 20,
    features: [
      '5+ main dishes customized to your taste',
      'Live cooking station option',
      'Full appetizer spread',
      'Premium rice and bread selection',
      'Complete dessert bar',
      'Professional serving staff',
      'All equipment included',
      'Menu tasting session',
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya M.',
    location: 'Alpharetta, GA',
    content:
      'The Spice Rack has been our go-to for weekly meals. The food tastes exactly like my grandmother used to make. Authentic, fresh, and absolutely delicious!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael & Sarah T.',
    location: 'Johns Creek, GA',
    content:
      "We discovered them for a dinner party and now we're regular customers. The butter chicken is legendary, and the service is always impeccable.",
    rating: 5,
  },
  {
    id: '3',
    name: 'Raj K.',
    location: 'Duluth, GA',
    content:
      "Finally, home-style Indian food without spending hours in the kitchen! Perfect spice levels and generous portions. Can't recommend enough.",
    rating: 5,
  },
  {
    id: '4',
    name: 'Jennifer L.',
    location: 'Roswell, GA',
    content:
      'They catered our company event and received rave reviews from everyone. Professional, punctual, and the food was spectacular.',
    rating: 5,
  },
];
