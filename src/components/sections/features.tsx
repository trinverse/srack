'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { qualityHighlights } from '@/data/site';

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Text */}
          <div className="max-w-2xl">
            {/* Section Header */}
            <div className="mb-10 text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-3xl md:text-4xl font-extrabold text-foreground tracking-tight"
              >
                True Indian Cuisine, Crafted with Tradition
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-foreground/80 text-xl font-bold"
              >
                Authentic spices, freshly cooked
              </motion.p>
            </div>

            {/* Quality Highlights */}
            <div className="space-y-6">
              {qualityHighlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start gap-4 p-2"
                >
                  <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <span className="font-bold text-foreground text-sm uppercase tracking-wider">{item.title}</span>
                    <span className="text-muted-foreground text-sm"> {' \u2014 '} {item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/img/homeimg1.webp"
                alt="Twice a week home delivery tiffin service"
                width={800}
                height={1000}
                className="w-full h-auto object-contain"
                unoptimized={true}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
