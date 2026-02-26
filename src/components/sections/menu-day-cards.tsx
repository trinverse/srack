'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const days = [
  {
    title: 'Monday Delivery',
    subtitle: "Today's Special Menu",
    note: 'Order 36 Hours In Advance',
    href: '/menu?day=monday',
    image: '/img/mondayimg.webp',
  },
  {
    title: 'Thursday Delivery',
    subtitle: "Today's Special Menu",
    note: 'Order 36 Hours In Advance',
    href: '/menu?day=thursday',
    image: '/img/thrusdayimg.webp',
  },
];

export function MenuDayCards() {
  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="flex flex-col gap-20 max-w-6xl mx-auto">
          {days.map((day, index) => {
            const isReverse = index % 2 !== 0; // Odd index (Thursday) text left, image right
            return (
              <motion.div
                key={day.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isReverse ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={day.image}
                    alt={day.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    unoptimized={true}
                  />
                </div>

                {/* Text Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left">
                  <h3 className="text-3xl font-extrabold mb-3 text-foreground tracking-tight">
                    {day.title}
                  </h3>
                  <p className="text-foreground/80 font-semibold text-lg mb-4">
                    {day.subtitle}
                  </p>
                  <p className="text-muted-foreground text-sm mb-8">
                    {day.note}
                  </p>
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="bg-emerald text-white rounded-none hover:bg-emerald/90 font-bold uppercase tracking-wider px-8"
                  >
                    <Link href={day.href}>
                      Order Now
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
