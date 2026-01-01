'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Truck,
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { howItWorks, contactInfo } from '@/data/site';

const stepIcons = [Search, ShoppingCart, Truck];

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
            className="max-w-2xl"
          >
            <h1 className="mb-4">How It Works</h1>
            <p className="text-muted-foreground text-lg">
              Getting fresh, home-style Indian food delivered to your doorstep
              is simple. Here&apos;s everything you need to know.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, index) => {
              const Icon = stepIcons[index];
              const isLast = index === howItWorks.length - 1;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-8 pb-16"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center relative z-10">
                      <Icon className="h-8 w-8" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-border mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-3">
                    <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-3">
                      Step {step.step}
                    </div>
                    <h3 className="mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Details */}
      <section className="py-20 bg-secondary/50">
        <div className="container-wide">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            Important Details
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3">Order Deadlines</h4>
                  <p className="text-muted-foreground">
                    <strong>Monday delivery:</strong> Order by Saturday 6 PM
                    <br />
                    <strong>Thursday delivery:</strong> Order by Tuesday 6 PM
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3">Delivery Areas</h4>
                  <p className="text-muted-foreground">
                    We deliver throughout the greater Atlanta metro area
                    including Alpharetta, Roswell, Johns Creek, Duluth, and
                    Suwanee.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-8 text-center">
                  <UtensilsCrossed className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3">Fresh Guarantee</h4>
                  <p className="text-muted-foreground">
                    Every meal is prepared fresh on delivery day. We never use
                    frozen ingredients or pre-made components.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Browse this week&apos;s menu and place your first order. Questions?
              We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/menu">
                  View Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
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
