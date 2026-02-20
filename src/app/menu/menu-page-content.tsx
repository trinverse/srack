'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, Leaf, AlertCircle, ShoppingCart, Plus, Minus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem as BaseMenuItem, PickupLocation, MenuCategory } from '@/types/database';

interface MenuItem extends BaseMenuItem {
  gallery_images?: string[] | null;
}

interface MenuPageContentProps {
  menuItems: MenuItem[];
  menuActive: boolean;
  mondayActive: boolean;
  thursdayActive: boolean;
  pickupLocations: PickupLocation[];
}

const categoryLabels: Record<MenuCategory, string> = {
  veg_entrees: 'Veg Entrees',
  non_veg_entrees: 'Non-Veg Entrees',
  dal_entrees: 'Dal Entrees',
  roties_rice: 'Roties & Rice',
  special_items: 'Special Items',
};

const categoryOrder: MenuCategory[] = [
  'veg_entrees',
  'non_veg_entrees',
  'dal_entrees',
  'roties_rice',
  'special_items',
];

const spiceLevelColors = {
  mild: 'text-green-600',
  medium: 'text-orange-500',
  hot: 'text-red-500',
};

const dietaryTagLabels: Record<string, { label: string; color: string }> = {
  vegetarian: { label: 'V', color: 'bg-green-100 text-green-700' },
  non_vegetarian: { label: 'NV', color: 'bg-red-100 text-red-700' },
  vegan: { label: 'VG', color: 'bg-emerald-100 text-emerald-700' },
  gluten_free: { label: 'GF', color: 'bg-amber-100 text-amber-700' },
};

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<'8oz' | '16oz'>('8oz');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const price = item.has_size_options
    ? selectedSize === '8oz'
      ? item.price_8oz
      : item.price_16oz
    : item.single_price;

  const images = item.gallery_images && item.gallery_images.length > 0
    ? item.gallery_images.filter(Boolean)
    : item.image_url ? [item.image_url] : [];

  const handleAddToCart = () => {
    addItem(item, item.has_size_options ? selectedSize : null, quantity);
    setQuantity(1);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-border/50 hover:border-emerald/30">
      <div className="relative w-full h-52 bg-muted/20 overflow-hidden flex items-center justify-center">
        {images.length > 0 ? (
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${item.name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Handle image load error silently, let background show
              }}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald/5 to-primary/5 text-emerald/20">
            <div className="w-16 h-16 rounded-full border-2 border-emerald/10 flex items-center justify-center text-3xl font-bold">
              {item.name.charAt(0)}
            </div>
            <span className="text-[10px] uppercase tracking-widest mt-2 font-semibold">Spice Rack Atlanta</span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    idx === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {item.is_popular && (
                <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold-dark rounded-full">
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {item.dietary_tags?.map((tag) => {
                const tagInfo = dietaryTagLabels[tag];
                if (!tagInfo) return null;
                return (
                  <span
                    key={tag}
                    className={cn('text-xs px-1.5 py-0.5 rounded', tagInfo.color)}
                    title={tag.replace('_', ' ')}
                  >
                    {tagInfo.label}
                  </span>
                );
              })}
              {item.spice_level && (
                <div className={cn('flex ml-1', spiceLevelColors[item.spice_level])}>
                  {item.spice_level === 'mild' && <Flame className="h-3 w-3" />}
                  {item.spice_level === 'medium' && (
                    <>
                      <Flame className="h-3 w-3" />
                      <Flame className="h-3 w-3" />
                    </>
                  )}
                  {item.spice_level === 'hot' && (
                    <>
                      <Flame className="h-3 w-3" />
                      <Flame className="h-3 w-3" />
                      <Flame className="h-3 w-3" />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* Size Options */}
        {item.has_size_options ? (
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSelectedSize('8oz')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                selectedSize === '8oz'
                  ? 'border-emerald bg-emerald/10 text-emerald'
                  : 'border-border hover:border-emerald/50'
              )}
            >
              8oz - ${item.price_8oz?.toFixed(2)}
            </button>
            <button
              onClick={() => setSelectedSize('16oz')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors',
                selectedSize === '16oz'
                  ? 'border-emerald bg-emerald/10 text-emerald'
                  : 'border-border hover:border-emerald/50'
              )}
            >
              16oz - ${item.price_16oz?.toFixed(2)}
            </button>
          </div>
        ) : (
          <div className="text-lg font-bold text-emerald mb-3">
            ${item.single_price?.toFixed(2)}
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleAddToCart} className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add ${((price || 0) * quantity).toFixed(2)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MenuPageContent({
  menuItems,
  menuActive,
  mondayActive,
  thursdayActive,
  pickupLocations,
}: MenuPageContentProps) {
  const { state } = useCart();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Group items by category
  const itemsByCategory = categoryOrder.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!menuActive) {
    return (
      <div className="pt-20">
        <section className="py-16">
          <div className="container-wide text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Menu Currently Unavailable</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We&apos;re updating our menu. Please check back soon or contact us for more information.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4">Tiffin Menu</h1>
            <p className="text-muted-foreground text-lg">
              Fresh, home-style Indian meals prepared with love. Order by Sunday noon for Monday delivery, or Wednesday noon for Thursday delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Day Info */}
      <section className="py-8 border-b">
        <div className="container-wide">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className={cn(
              'flex items-center gap-3 px-6 py-3 rounded-lg border',
              mondayActive ? 'border-emerald bg-emerald/5' : 'border-muted bg-muted/50 opacity-60'
            )}>
              <Calendar className="h-5 w-5 text-emerald" />
              <div>
                <div className="font-semibold">Monday Delivery</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Order by Sunday 12:00 PM
                </div>
              </div>
              {mondayActive && (
                <span className="text-xs px-2 py-1 bg-emerald text-white rounded-full">
                  Open
                </span>
              )}
            </div>
            <div className={cn(
              'flex items-center gap-3 px-6 py-3 rounded-lg border',
              thursdayActive ? 'border-gold bg-gold/5' : 'border-muted bg-muted/50 opacity-60'
            )}>
              <Calendar className="h-5 w-5 text-gold" />
              <div>
                <div className="font-semibold">Thursday Delivery</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Order by Wednesday 12:00 PM
                </div>
              </div>
              {thursdayActive && (
                <span className="text-xs px-2 py-1 bg-gold text-white rounded-full">
                  Open
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter and Search */}
      <section className="py-2 border-b sticky top-16 bg-background/95 backdrop-blur-md z-40 shadow-sm transition-all">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-0 scrollbar-hide w-full lg:w-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ring-1 ring-inset',
                  activeCategory === 'all'
                    ? 'bg-emerald text-white ring-emerald'
                    : 'bg-white text-muted-foreground ring-border hover:bg-muted/50'
                )}
              >
                All Items
              </button>
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ring-1 ring-inset',
                    activeCategory === category
                      ? 'bg-emerald text-white ring-emerald'
                      : 'bg-white text-muted-foreground ring-border hover:bg-muted/50'
                  )}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Search Bar - More Compact */}
            <div className="relative w-full lg:max-w-[280px] group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-emerald" />
              </div>
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 h-9 w-full bg-muted/20 border-border focus:border-emerald/50 focus:bg-background transition-all rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-8">
        <div className="container-wide">
          {activeCategory === 'all' ? (
            // Show all categories with headers
            categoryOrder.map((category) => {
              const items = itemsByCategory[category].filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12 last:mb-0">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {category.includes('veg') && !category.includes('non') && (
                      <Leaf className="h-6 w-6 text-green-600" />
                    )}
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <MenuItemCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show filtered category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MenuItemCard item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Cart Summary */}
      {state.itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">{state.itemCount} items</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <span className="font-bold">${state.subtotal.toFixed(2)}</span>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-emerald hover:bg-white/90"
              asChild
            >
              <Link href="/cart">View Cart</Link>
            </Button>
          </motion.div>
        </div>
      )}

      {/* Pickup Locations */}
      {pickupLocations.length > 0 && (
        <section className="py-12 bg-secondary/50">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-6 text-center">Pickup Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pickupLocations.map((location) => (
                <Card key={location.id} className="p-4">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {location.address}, {location.city}, {location.state} {location.zip_code}
                  </p>
                  {location.pickup_time && (
                    <p className="text-sm text-emerald mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {location.pickup_time}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
