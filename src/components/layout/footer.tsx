'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Phone, Mail, Send } from 'lucide-react';
import { siteConfig, contactInfo } from '@/data/site';
import { Button } from '@/components/ui/button';

const informationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'FAQs', href: '/faq' },
];

const shopLinks = [
  { label: 'Our Menu', href: '/menu' },
  { label: 'Catering', href: '/catering' },
];

const customerServiceLinks = [
  { label: 'Contact', href: '/contact' },
];

const paymentMethods = [
  'Visa',
  'Mastercard',
  'American Express',
  'Apple Pay',
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [email, setEmail] = useState('');

  // Hide footer on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, submit to email service
    setEmail('');
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Information
            </h4>
            <ul className="space-y-3">
              {informationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {customerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-2 text-background/70 hover:text-accent transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-2 text-background/70 hover:text-accent transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Sign Up for Curry Club */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Sign Up for Curry Club
            </h4>
            <p className="text-background/60 text-sm">
              Sign up for exclusive updates, new arrivals &amp; insider only discounts
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-3 py-2 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {contactInfo.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-accent transition-colors"
                  aria-label={`Follow us on ${social.platform}`}
                >
                  {social.platform === 'facebook' && <Facebook className="h-5 w-5" />}
                  {social.platform === 'instagram' && <Instagram className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-background/50 text-sm">
            &copy; {currentYear} {siteConfig.name}. All Rights Reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center space-x-3">
            <span className="text-background/40 text-xs">Payment methods</span>
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="text-background/50 text-xs bg-background/10 px-2 py-1 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
