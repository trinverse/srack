'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mondayMenu, thursdayMenu } from '@/data/menu';
import { cn } from '@/lib/utils';

const spiceLevelColors = {
  1: 'text-green-600',
  2: 'text-orange-500',
  3: 'text-red-500',
};

export default function MenuPage() {
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
            <h1 className="mb-4">Weekly Menu</h1>
            <p className="text-muted-foreground text-lg">
              Fresh, home-style Indian meals prepared with love. Our menu
              rotates weekly to bring you variety and seasonal ingredients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Days */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monday Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="bg-primary text-primary-foreground p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-primary-foreground">
                        Monday Menu
                      </h2>
                      <p className="text-primary-foreground/80 flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Order by: {mondayMenu.orderDeadline}
                      </p>
                    </div>
                    <Calendar className="h-12 w-12 text-primary-foreground/50" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    {mondayMenu.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.spiceLevel && (
                              <div
                                className={cn(
                                  'flex',
                                  spiceLevelColors[item.spiceLevel]
                                )}
                              >
                                {Array.from({ length: item.spiceLevel }).map(
                                  (_, i) => (
                                    <Flame key={i} className="h-3 w-3" />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <span className="font-semibold text-primary ml-4">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/menu/monday">
                      View Full Monday Menu
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Thursday Menu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="bg-accent text-accent-foreground p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Thursday Menu</h2>
                      <p className="text-accent-foreground/80 flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-2" />
                        Order by: {thursdayMenu.orderDeadline}
                      </p>
                    </div>
                    <Calendar className="h-12 w-12 text-accent-foreground/50" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    {thursdayMenu.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.spiceLevel && (
                              <div
                                className={cn(
                                  'flex',
                                  spiceLevelColors[item.spiceLevel]
                                )}
                              >
                                {Array.from({ length: item.spiceLevel }).map(
                                  (_, i) => (
                                    <Flame key={i} className="h-3 w-3" />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <span className="font-semibold text-primary ml-4">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/menu/thursday">
                      View Full Thursday Menu
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container-tight text-center">
          <h3 className="mb-4">How Ordering Works</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Our menu changes weekly to bring you fresh, seasonal dishes. Orders
            must be placed 36 hours before delivery day to ensure we can source
            the freshest ingredients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild>
              <Link href="/how-it-works">Learn More About Ordering</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
