'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { howItWorks } from '@/data/site';

const stepImages = [
  '/img/img1.webp',
  '/img/img2.webp',
  '/img/img3.webp',
  '/img/img4.webp'
];

export function HowItWorksPreview() {
  return (
    <section className="py-24 bg-white text-foreground">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 relative">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-foreground/20 flex-1 hidden sm:block" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-foreground uppercase tracking-widest text-lg md:text-xl font-bold font-sans whitespace-nowrap"
            >
              Delicious Meals, Delivered Simply
            </motion.h2>
            <div className="h-px bg-foreground/20 flex-1 hidden sm:block" />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {howItWorks.map((step, index) => {
            const imageSrc = stepImages[index];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative flex flex-col items-center"
              >

                {/* Image instead of Icon */}
                <div className="relative w-48 h-48 mb-8">
                  <Image
                    src={imageSrc}
                    alt={step.title}
                    fill
                    className="object-contain"
                    unoptimized={true}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
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
            variant="default"
            className="bg-emerald hover:bg-emerald/90 text-white rounded-full px-8 py-6 text-lg font-bold"
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
