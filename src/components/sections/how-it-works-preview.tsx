'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ShoppingCart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { howItWorks } from '@/data/site';

const icons = [Search, ShoppingCart, Truck];

export function HowItWorksPreview() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-primary-foreground"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary-foreground/80 text-lg"
          >
            Getting delicious home-style Indian food is simple.
            Three easy steps to your next meal.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {howItWorks.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-primary-foreground/20" />
                )}

                {/* Step number with icon */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-primary-foreground text-primary rounded-full mb-6">
                  <Icon className="h-10 w-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-primary-foreground">
                  {step.title}
                </h3>
                <p className="text-primary-foreground/70">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/how-it-works">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
