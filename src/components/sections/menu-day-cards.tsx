'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const days = [
  {
    title: 'Monday Delivery',
    subtitle: "Today's Special Menu",
    note: 'Order 36 Hours In Advance',
    href: '/menu/monday',
  },
  {
    title: 'Thursday Delivery',
    subtitle: "Today's Special Menu",
    note: 'Order 36 Hours In Advance',
    href: '/menu/thursday',
  },
];

export function MenuDayCards() {
  return (
    <section className="py-16 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {days.map((day, index) => (
            <motion.div
              key={day.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-2">{day.title}</h3>
              <p className="text-primary-foreground/90 text-lg font-medium mb-3">
                {day.subtitle}
              </p>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-6">
                <Clock className="h-4 w-4" />
                <span>{day.note}</span>
              </div>
              <Button
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
              >
                <Link href={day.href}>
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
