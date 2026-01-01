import { FAQItem, CateringTier, Testimonial } from '@/types';

export const faqItems: FAQItem[] = [
  {
    id: 'how-to-order',
    question: 'How do I place an order?',
    answer:
      'You can place an order through our website or by calling us directly. Simply browse our weekly menu, select your items, and checkout. Orders must be placed at least 36 hours before the delivery day.',
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
      'We currently deliver to the greater Atlanta metro area, including Alpharetta, Roswell, Johns Creek, Duluth, Suwanee, and surrounding neighborhoods. Contact us to confirm if we deliver to your area.',
    category: 'delivery',
  },
  {
    id: 'order-deadline',
    question: 'What is the order deadline?',
    answer:
      'Orders must be placed at least 36 hours before the delivery day. For Monday deliveries, order by Saturday 6:00 PM. For Thursday deliveries, order by Tuesday 6:00 PM.',
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
