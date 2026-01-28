import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SettingsManagement } from './settings-management';

export const metadata: Metadata = {
  title: 'Settings - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Fetch pickup locations
  const { data: pickupLocations } = await supabase
    .from('pickup_locations')
    .select('*')
    .order('name');

  // Fetch delivery zones
  const { data: deliveryZones } = await supabase
    .from('delivery_zones')
    .select('*')
    .order('zip_code');

  // Fetch discount codes
  const { data: discountCodes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('code');

  // Fetch loyalty settings
  const { data: loyaltySettings } = await supabase
    .from('loyalty_settings')
    .select('*')
    .single();

  return (
    <SettingsManagement
      initialPickupLocations={pickupLocations || []}
      initialDeliveryZones={deliveryZones || []}
      initialDiscountCodes={discountCodes || []}
      initialLoyaltySettings={loyaltySettings}
    />
  );
}
