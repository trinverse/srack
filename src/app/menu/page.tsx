import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MenuPageContent } from './menu-page-content';

export const metadata: Metadata = {
  title: 'Tiffin Menu',
  description: 'Explore our authentic Indian tiffin menu. Fresh, home-style meals prepared with love, available for delivery or pickup every Monday and Thursday.',
};

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const supabase = await createClient();

  // Fetch all active menu items
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Fetch menu settings
  const { data: settings } = await supabase
    .from('menu_settings')
    .select('*');

  const menuActive = settings?.find(s => s.setting_key === 'menu_active')?.setting_value === 'true';
  const mondayActive = settings?.find(s => s.setting_key === 'monday_menu_active')?.setting_value === 'true';
  const thursdayActive = settings?.find(s => s.setting_key === 'thursday_menu_active')?.setting_value === 'true';

  // Fetch active pickup locations
  const { data: pickupLocations } = await supabase
    .from('pickup_locations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu:', error);
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive">Error loading menu</h1>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <MenuPageContent
      menuItems={menuItems || []}
      menuActive={menuActive}
      mondayActive={mondayActive}
      thursdayActive={thursdayActive}
      pickupLocations={pickupLocations || []}
    />
  );
}
