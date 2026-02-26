'use client';

import { motion } from 'framer-motion';
import { qualityHighlights } from '@/data/site';

export function Features() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              True Indian Cuisine, Crafted with Tradition
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Authentic spices, freshly cooked
            </motion.p>
          </div>

          {/* Quality Highlights */}
          <div className="space-y-5">
            {qualityHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-start gap-4 bg-background rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <span className="font-bold text-foreground">{item.title}</span>
                  {' \u2014 '}
                  <span className="text-muted-foreground">{item.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
