'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Flame, Leaf, AlertCircle, ShoppingCart, Plus, Minus, Search, ChevronLeft, ChevronRight, CheckCircle2, MessageSquarePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { MenuItem as BaseMenuItem, PickupLocation, MenuCategory, WeeklyMenu } from '@/types/database';
import { getNextWeekday, getISOString, formatDate, getNearestActiveDay } from '@/lib/date-utils';

interface MenuItem extends BaseMenuItem {
  gallery_images?: string[] | null;
}

interface MenuPageContentProps {
  menuItems: MenuItem[];
  menuActive: boolean;
  mondayActive: boolean;
  thursdayActive: boolean;
  pickupLocations: PickupLocation[];
  weeklyMenus: WeeklyMenu[];
}

const categoryLabels: Record<MenuCategory, string> = {
  veg_entrees: 'Veg Entrees',
  non_veg_entrees: 'Non-Veg Entrees',
  dal_entrees: 'Dal Entrees',
  roties_rice: 'Roties & Rice',
  special_items: 'Special Items',
  breakfast: 'Breakfast',
  dessert: 'Dessert',
  chutneys: 'Chutneys',
  sides: 'Sides',
};

const categoryOrder: MenuCategory[] = [
  'special_items',
  'veg_entrees',
  'non_veg_entrees',
  'dal_entrees',
  'roties_rice',
  'breakfast',
  'dessert',
  'chutneys',
  'sides',
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

function MenuItemCard({
  item,
  isInWeeklyMenu = true,
  orderDay,
  onRequested,
  onImageClick
}: {
  item: MenuItem;
  isInWeeklyMenu?: boolean;
  orderDay?: 'monday' | 'thursday';
  onRequested?: () => void;
  onImageClick?: (url: string) => void;
}) {
  const { addItem, setOrderDay } = useCart();
  const supabase = createClient();
  const [selectedSize, setSelectedSize] = useState<'8oz' | '16oz'>('8oz');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

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
    if (orderDay) setOrderDay(orderDay);
    setQuantity(1);
  };

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('menu_requests' as any)
        .insert({
          menu_item_id: item.id,
          item_name: item.name,
          customer_id: user?.id,
          status: 'pending'
        });

      if (error) throw error;

      setHasRequested(true);
      if (onRequested) onRequested();
    } catch (err) {
      console.error('Error requesting item:', err);
      alert('Failed to request item. Please try again later.');
    } finally {
      setIsRequesting(false);
    }
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
      <div
        className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden flex items-center justify-center cursor-zoom-in"
        onClick={() => images.length > 0 && onImageClick?.(images[currentImageIndex])}
      >
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
            />
            {/* Overlay gradient for better text legibility if needed, but here it's for premium feel */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          {isInWeeklyMenu ? (
            <>
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
            </>
          ) : (
            <Button
              onClick={handleRequest}
              disabled={isRequesting || hasRequested}
              className={cn(
                "flex-1 transition-all",
                hasRequested ? "bg-emerald/10 text-emerald border-emerald hover:bg-emerald/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              variant={hasRequested ? "outline" : "secondary"}
            >
              {isRequesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Requesting...
                </>
              ) : hasRequested ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Requested
                </>
              ) : (
                <>
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Request this Item
                </>
              )}
            </Button>
          )}
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
  weeklyMenus,
}: MenuPageContentProps) {
  const { state } = useCart();
  const { isStaff } = useAuth();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');

  // New state for day selection: 'monday' | 'thursday'
  let initialDayStr = getNearestActiveDay(mondayActive, thursdayActive) || 'monday';
  if (dayParam === 'monday' && mondayActive) initialDayStr = 'monday';
  if (dayParam === 'thursday' && thursdayActive) initialDayStr = 'thursday';

  const [selectedView, setSelectedView] = useState<'monday' | 'thursday' | 'full'>(
    initialDayStr as 'monday' | 'thursday' | 'full'
  );

  // Date Logic
  const nextMonday = getNextWeekday('Monday');
  const nextThursday = getNextWeekday('Thursday');
  const nextMondayISO = getISOString(nextMonday);
  const nextThursdayISO = getISOString(nextThursday);

  // Get items for Monday and Thursday separately
  const mondayItemIds = new Set(
    weeklyMenus
      .filter(wm => wm.order_day === 'monday' && wm.menu_date === nextMondayISO)
      .map(wm => wm.menu_item_id)
  );

  const thursdayItemIds = new Set(
    weeklyMenus
      .filter(wm => wm.order_day === 'thursday' && wm.menu_date === nextThursdayISO)
      .map(wm => wm.menu_item_id)
  );

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Strict day filtering for Monday and Thursday when NOT searching
    // If searching, we show EVERYTHING so they can "demand" any product
    let matchesVisibility = true;
    if (searchQuery === '' && selectedView !== 'full') {
      if (selectedView === 'monday') {
        matchesVisibility = mondayItemIds.has(item.id);
      } else if (selectedView === 'thursday') {
        matchesVisibility = thursdayItemIds.has(item.id);
      }
    }

    return matchesCategory && matchesSearch && matchesVisibility;
  });

  const displayItems = filteredItems;

  const isItemInWeekly = (itemId: string, day: 'monday' | 'thursday') => {
    return day === 'monday' ? mondayItemIds.has(itemId) : thursdayItemIds.has(itemId);
  };

  // Group items by category for the "all" view
  const categoriesToRender = categoryOrder.filter(cat =>
    displayItems.some(item => item.category === cat)
  );

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
            <h1 className="mb-4 text-3xl font-bold">Tiffin Menu</h1>
            <p className="text-muted-foreground text-lg">
              Fresh, home-style Indian meals prepared with love. Order by Sunday noon for Monday delivery, or Wednesday noon for Thursday delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Day Info */}
      <section className="py-8 border-b">
        <div className="container-wide">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-lg border transition-all',
                mondayActive ? 'border-emerald bg-emerald/5 ring-1 ring-emerald/20' : 'border-muted bg-muted/50 opacity-60'
              )}>
                <Calendar className="h-5 w-5 text-emerald" />
                <div>
                  <div className="font-semibold text-sm md:text-base">Monday Delivery</div>
                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {mondayActive ? `Accepting for ${formatDate(nextMonday)}` : 'Closed'}
                  </div>
                </div>
                {mondayActive && (
                  <span className="text-[10px] px-2 py-1 bg-emerald text-white rounded-full animate-pulse capitalize">
                    Active
                  </span>
                )}
              </div>
              <div className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-lg border transition-all',
                thursdayActive ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-muted bg-muted/50 opacity-60'
              )}>
                <Calendar className="h-5 w-5 text-gold" />
                <div>
                  <div className="font-semibold text-sm md:text-base">Thursday Delivery</div>
                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {thursdayActive ? `Accepting for ${formatDate(nextThursday)}` : 'Closed'}
                  </div>
                </div>
                {thursdayActive && (
                  <span className="text-[10px] px-2 py-1 bg-gold text-white rounded-full animate-pulse capitalize">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Combined View Selector */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full border max-w-full overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedView('monday')}
                  disabled={!mondayActive}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                    selectedView === 'monday'
                      ? "bg-white shadow-sm text-emerald ring-1 ring-emerald/10"
                      : "text-muted-foreground hover:text-foreground disabled:opacity-30"
                  )}
                >
                  Monday Menu
                </button>
                <button
                  onClick={() => setSelectedView('thursday')}
                  disabled={!thursdayActive}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                    selectedView === 'thursday'
                      ? "bg-white shadow-sm text-emerald ring-1 ring-emerald/10"
                      : "text-muted-foreground hover:text-foreground disabled:opacity-30"
                  )}
                >
                  Thursday Menu
                </button>
              </div>

              {selectedView !== 'full' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground flex items-center gap-1.5"
                >
                  <Clock className="h-3 w-3" />
                  Showing items available for {selectedView === 'monday' ? formatDate(nextMonday) : formatDate(nextThursday)}
                </motion.div>
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

            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-full bg-muted/20 border-border focus:border-emerald/50 focus:bg-background transition-all rounded-lg text-sm"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={cn(
                  "flex items-center justify-center h-9 w-9 min-w-[36px] rounded-lg border transition-all shadow-sm shrink-0",
                  isSearchExpanded ? "bg-emerald text-white border-emerald" : "bg-white text-muted-foreground border-border hover:bg-muted"
                )}
                aria-label="Toggle search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-8 min-h-[400px]">
        <div className="container-wide">
          {activeCategory === 'all' ? (
            categoriesToRender.map((category) => {
              const items = displayItems.filter(item => item.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-12 last:mb-0">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {category.includes('veg') && !category.includes('non') && (
                      <Leaf className="h-6 w-6 text-green-600" />
                    )}
                    {categoryLabels[category]}
                    <span className="text-sm font-normal text-muted-foreground ml-2">({items.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <MenuItemCard
                          item={item}
                          isInWeeklyMenu={selectedView === 'full' ? (isItemInWeekly(item.id, 'monday') || isItemInWeekly(item.id, 'thursday')) : (selectedView === 'monday' ? isItemInWeekly(item.id, 'monday') : isItemInWeekly(item.id, 'thursday'))}
                          orderDay={selectedView !== 'full' ? selectedView : undefined}
                          onImageClick={setSelectedFullImage}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MenuItemCard
                    item={item}
                    isInWeeklyMenu={selectedView === 'full' ? (isItemInWeekly(item.id, 'monday') || isItemInWeekly(item.id, 'thursday')) : (selectedView === 'monday' ? isItemInWeekly(item.id, 'monday') : isItemInWeekly(item.id, 'thursday'))}
                    onImageClick={setSelectedFullImage}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {displayItems.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button
                variant="link"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); setSelectedView(initialDayStr as any); }}
                className="mt-2 text-emerald"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Floating Cart Placeholder */}
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
              {pickupLocations.map((location) => {
                const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.zip_code}`;
                const mapQuery = encodeURIComponent(fullAddress);
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
                return (
                  <Card key={location.id} className="overflow-hidden">
                    {/* Google Map Embed */}
                    <div className="w-full h-40 bg-muted">
                      {apiKey ? (
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapQuery}&zoom=14`}
                          title={`Map of ${location.name}`}
                        />
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {fullAddress}
                      </p>
                      {location.pickup_time && (
                        <p className="text-sm text-emerald mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {location.pickup_time}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedFullImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full aspect-auto bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedFullImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative w-full h-[80vh] flex items-center justify-center">
                <Image
                  src={selectedFullImage}
                  alt="Full preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
