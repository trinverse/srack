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

  return (
    <MenuManagement
      initialMenuItems={menuItems || []}
      initialSettings={settings || []}
    />
  );
}
