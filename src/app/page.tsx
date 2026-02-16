
import { createClient } from '@/lib/supabase/server';
import { buildGalleryManifest } from '@/lib/image-matcher';
import {
  Hero,
  Features,
  HowItWorksPreview,
  Testimonials,
  CTA,
  WelcomeOffer,
} from '@/components/sections';
import { DeliveryZoneChecker } from '@/components/delivery-zone-checker';
import { MenuPreview } from '@/components/sections/menu-preview';

export default async function Home() {
  // Fetch popular menu items from DB
  const supabase = await createClient();
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, description, price, category, is_popular, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Build gallery manifest from local files
  const galleryManifest = buildGalleryManifest(menuItems || []);

  // Pick popular items or first 8 with images
  let popularItems = (menuItems || [])
    .map(item => {
      const localImages = galleryManifest[item.id];
      return {
        ...item,
        image_url: localImages?.[0] || item.image_url || null,
      };
    })
    .filter(item => item.image_url); // Only items with images

  // Prefer items marked popular, fallback to any with images
  const markedPopular = popularItems.filter(item => item.is_popular);
  if (markedPopular.length >= 4) {
    popularItems = markedPopular.slice(0, 8);
  } else {
    // Mix popular items first, then fill with others
    const others = popularItems.filter(item => !item.is_popular);
    popularItems = [...markedPopular, ...others].slice(0, 8);
  }

  return (
    <>
      <Hero />
      <WelcomeOffer />
      <DeliveryZoneChecker />
      <Features />
      <MenuPreview items={popularItems} />
      <HowItWorksPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
