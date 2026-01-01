import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail } from 'lucide-react';
import { siteConfig, navigation, contactInfo } from '@/data/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{siteConfig.name}</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
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
                  {social.platform === 'twitter' && <Twitter className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navigation.slice(0, 5).map((item) => (
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

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Delivery Schedule
            </h4>
            <ul className="space-y-3">
              {contactInfo.hours.map((schedule, index) => (
                <li key={index} className="text-sm">
                  <span className="text-background/50">{schedule.days}:</span>
                  <br />
                  <span className="text-background/70">{schedule.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-3 text-background/70 hover:text-accent transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-3 text-background/70 hover:text-accent transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-background/50 text-sm">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-background/50 text-sm">
            Licensed professionals since 2014
          </p>
        </div>
      </div>
    </footer>
  );
}
