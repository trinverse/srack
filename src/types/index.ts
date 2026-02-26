// Navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Menu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: MenuCategory;
  dietaryTags: DietaryTag[];
  spiceLevel?: 1 | 2 | 3;
  isPopular?: boolean;
}

export type MenuCategory =
  | 'appetizer'
  | 'main'
  | 'rice'
  | 'bread'
  | 'side'
  | 'dessert'
  | 'beverage';

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'contains-nuts';

export interface WeeklyMenu {
  day: 'monday' | 'thursday';
  date: string;
  items: MenuItem[];
  orderDeadline: string;
}

// FAQ
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory =
  | 'ordering'
  | 'delivery'
  | 'dietary'
  | 'payments'
  | 'catering'
  | 'subscription'
  | 'account';

// Catering
export interface CateringTier {
  id: string;
  name: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  features: string[];
}

// Testimonials
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  image?: string;
}

// Contact
export interface ContactInfo {
  phone: string;
  email: string;
  address?: string;
  hours: BusinessHours[];
  socialLinks: SocialLink[];
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'yelp';
  url: string;
}
