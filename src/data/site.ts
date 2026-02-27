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
  phone: '(910) 703-5199',
  email: 'spicerackatlanta@gmail.com',
  hours: [
    { days: 'Delivery Days', hours: 'Mon & Thu' },
    { days: 'Order Deadline', hours: '30 hours in advance' },
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
    title: 'Order Online',
    description: 'Order from our ever-changing menu with new options every Monday and Thursday.',
    icon: 'shopping-cart',
  },
  {
    step: 2,
    title: 'We Cook For You',
    description: 'We cook fresh Indian meals with natural spices, no frozen ingredients, and no artificial additives.',
    icon: 'chef-hat',
  },
  {
    step: 3,
    title: 'We Deliver To You',
    description: 'We deliver fresh, authentic Indian meals across Atlanta on selected delivery days.',
    icon: 'truck',
  },
  {
    step: 4,
    title: 'Quick Heat Meals',
    description: 'Just heat up for 2\u20133 minutes and enjoy your favorite Indian dishes.',
    icon: 'flame',
  },
];

export const qualityHighlights = [
  {
    emoji: '\uD83C\uDF72',
    title: 'Home-Style Cooking',
    description: 'Just like mom\u2019s kitchen\u2014fresh, wholesome, and never restaurant-style.',
  },
  {
    emoji: '\uD83C\uDF3F',
    title: 'Freshly Made',
    description: 'Every dish is cooked on the day of delivery, using freshly cut vegetables, never frozen or canned.',
  },
  {
    emoji: '\u274C',
    title: 'No Shortcuts',
    description: 'No artificial colors, no flavor enhancers, and no excessive oil or sodium.',
  },
  {
    emoji: '\uD83C\uDF36\uFE0F',
    title: 'Authentic Flavors',
    description: 'Natural spices and herbs deliver real taste with health benefits.',
  },
  {
    emoji: '\uD83D\uDE9A',
    title: 'Twice-a-Week Delivery',
    description: 'Enjoy fresh, home-style meals without the hassle of cooking, grocery shopping, or cleaning.',
  },
];
