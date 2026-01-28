import { NavItem, ContactInfo } from '@/types';

export const siteConfig = {
  name: 'The Spice Rack Atlanta',
  tagline: 'Tiffin & Catering Services',
  description:
    'Freshly made Indian meals delivered to your doorsteps. Home-style curries made with fresh ingredients, no frozen food, and time-honored recipes.',
  url: 'https://thespicerackatlanta.com',
  ogImage: '/images/og-image.jpg',
};

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Menu',
    href: '/menu',
    children: [
      { label: 'This Week', href: '/menu' },
      { label: 'Monday Menu', href: '/menu/monday' },
      { label: 'Thursday Menu', href: '/menu/thursday' },
    ],
  },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About Us', href: '/about' },
  { label: 'Catering', href: '/catering' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const contactInfo: ContactInfo = {
  phone: '(404) 555-0123',
  email: 'hello@thespicerackatlanta.com',
  hours: [
    { days: 'Delivery Days', hours: 'Mon & Thu' },
    { days: 'Order Deadline', hours: '36 hours in advance' },
  ],
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/thespicerackatlanta' },
    { platform: 'instagram', url: 'https://instagram.com/thespicerackatlanta' },
  ],
};

export const features = [
  {
    title: 'Same-Day Cooking',
    description: 'Every meal is prepared fresh on delivery day. Never frozen, always flavorful.',
    icon: 'flame',
  },
  {
    title: 'Fresh Ingredients',
    description: 'Hand-cut vegetables, natural spices, and quality proteins in every dish.',
    icon: 'leaf',
  },
  {
    title: 'Home-Style Recipes',
    description: 'Time-honored family recipes that taste like home, not a restaurant.',
    icon: 'heart',
  },
  {
    title: 'Health Conscious',
    description: 'Minimal oil, low sodium, no artificial colors or enhancers.',
    icon: 'shield',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Browse the Menu',
    description: 'Check our weekly rotating menu featuring authentic Indian dishes.',
  },
  {
    step: 2,
    title: 'Place Your Order',
    description: 'Order at least 36 hours before delivery day (Monday or Thursday).',
  },
  {
    step: 3,
    title: 'Enjoy Fresh Meals',
    description: 'Receive freshly prepared meals delivered right to your doorstep.',
  },
];
