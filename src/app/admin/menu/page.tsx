import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MenuManagement } from './menu-management';

export const metadata: Metadata = {
  title: 'Menu Management - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const supabase = await createClient();

  // Fetch all menu items (including inactive)
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('sort_order');

  // Fetch menu settings
  const { data: settings } = await supabase
    .from('menu_settings')
    .select('*');

  // Fetch weekly menus for upcoming Monday and Thursday
  // We'll fetch all weekly_menus and filter in memory or just fetch recent ones
  const { data: weeklyMenus } = await supabase
    .from('weekly_menus')
    .select('*')
    .gt('menu_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // last 7 days onwards

  return (
    <MenuManagement
      initialMenuItems={menuItems || []}
      initialSettings={settings || []}
      initialWeeklyMenus={weeklyMenus || []}
    />
  );
}
