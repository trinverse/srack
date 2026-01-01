'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/types';
import { cn } from '@/lib/utils';

const spiceLevelColors = {
  1: 'text-green-600',
  2: 'text-orange-500',
  3: 'text-red-500',
};

const categoryEmojis: Record<string, string> = {
  appetizer: '🥟',
  main: '🍛',
  rice: '🍚',
  bread: '🫓',
  side: '🥗',
  dessert: '🍮',
  beverage: '🥤',
};

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">
              {categoryEmojis[item.category] || '🍽️'}
            </span>
          </div>
          {item.isPopular && (
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Popular
            </div>
          )}
          <div className="absolute top-4 right-4 bg-background/90 text-foreground text-xs font-medium px-3 py-1 rounded-full capitalize">
            {item.category}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <span className="font-bold text-primary text-lg">
              ${item.price.toFixed(2)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {item.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary px-2 py-1 rounded capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
            {item.spiceLevel && (
              <div
                className={cn(
                  'flex items-center gap-0.5',
                  spiceLevelColors[item.spiceLevel]
                )}
                title={`Spice level: ${item.spiceLevel}/3`}
              >
                {Array.from({ length: item.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="h-4 w-4" />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
