'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PopularItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  image_url: string | null;
}

export function MenuPreview({ items }: { items: PopularItem[] }) {
  return (
    <section className="py-24">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              Popular Dishes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-xl"
            >
              Our most loved dishes, prepared fresh with authentic spices and
              time-honored recipes.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Button asChild variant="outline">
              <Link href="/menu">
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                {/* Real Image */}
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <span className="text-4xl">🍛</span>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full shadow-sm capitalize">
                      {item.category?.replace(/_/g, ' ').replace('entrees', '').trim() || 'Special'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-base leading-tight line-clamp-2">{item.name}</h3>
                    {item.price && (
                      <span className="font-bold text-primary whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
