'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-accent/10 via-background to-primary/10">
      <div className="container-tight text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="mb-6">Ready to Taste the Difference?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Order now for fresh, home-style Indian meals delivered to your
            doorstep. New customers enjoy 10% off their first order.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Link href="/menu">
                Browse Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <a href={`tel:${contactInfo.phone}`}>
                <Phone className="mr-2 h-5 w-5" />
                Call to Order
              </a>
            </Button>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Questions about catering?{' '}
            <Link href="/catering" className="text-primary hover:underline">
              Learn about our catering services
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
