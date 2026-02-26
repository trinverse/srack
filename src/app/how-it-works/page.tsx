'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  UtensilsCrossed,
  SlidersHorizontal,
  Truck,
  CreditCard,
  Phone,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/FfkXEt9f8ImA4wvLsBUk6A';

const steps = [
  {
    step: 1,
    title: 'ORDER ON YOUR SCHEDULE',
    icon: CalendarDays,
    content: (
      <>
        <p>
          Our service runs twice a week&mdash;<strong>Mondays &amp; Thursdays</strong>.
          Most customers order for 2&ndash;3 days on Monday and again on Thursday.
        </p>
      </>
    ),
  },
  {
    step: 2,
    title: 'ENJOY A FRESH & EVER-CHANGING MENU',
    icon: UtensilsCrossed,
    content: (
      <p>
        Our menu changes with every order, so you&apos;ll always have something new
        to try. No fixed combos&mdash;choose exactly what you want, how you want it.
      </p>
    ),
  },
  {
    step: 3,
    title: 'CUSTOMIZE YOUR MEAL',
    icon: SlidersHorizontal,
    content: (
      <div className="space-y-3">
        <p>
          Pick from curries, dals, rotis, rice, and special items&mdash;all individually priced.
        </p>
        <p>
          Choose 8oz (perfect for one) or 16oz (great for two).
        </p>
        <p>
          <strong>$30 minimum order required.</strong> Please place your order 36 hours in advance.
        </p>
        <p className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-500 shrink-0" />
          <span>
            Join our{' '}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              WhatsApp community
            </a>{' '}
            and email list for menu updates and reminders!
          </span>
        </p>
      </div>
    ),
  },
  {
    step: 4,
    title: 'CHOOSE DELIVERY OR PICKUP',
    icon: Truck,
    content: (
      <div className="space-y-3">
        <p>
          Enter your address, and we&apos;ll let you know if we deliver to your area.
        </p>
        <p>
          If delivery isn&apos;t available, you&apos;ll be directed to the nearest pickup location.
        </p>
        <p>
          <strong>Delivery Days:</strong> Mondays &amp; Thursdays, between 4:00 PM &ndash; 8:00 PM.
        </p>
        <p>Delivery fees apply based on your location.</p>
        <p>
          Include any gate codes, parking info, or special instructions to ensure a smooth delivery.
        </p>
      </div>
    ),
  },
  {
    step: 5,
    title: 'PAY & ENJOY!',
    icon: CreditCard,
    content: (
      <div className="space-y-3">
        <p>
          Pay securely online and receive a confirmation email once your order is placed.
        </p>
        <p>
          Sit back, relax, and enjoy fresh, homemade food&mdash;just the way you like it!
        </p>
      </div>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="mb-4">How It Works</h1>
            <h2 className="text-2xl font-bold text-primary uppercase tracking-wide">
              5 Easy Steps to Order Online
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Steps - Zigzag Layout */}
      <section className="py-20">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Number + Icon */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                          <Icon className="h-10 w-10" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                          {step.step}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${!isEven ? 'md:text-right' : ''}`}>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide">
                        {step.title}
                      </h3>
                      <div className="text-muted-foreground text-base leading-relaxed">
                        {step.content}
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="w-0.5 h-12 bg-border" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-primary-foreground">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Browse this week&apos;s menu and place your first order. Questions?
              We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/menu">
                  View Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href={`tel:${contactInfo.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
