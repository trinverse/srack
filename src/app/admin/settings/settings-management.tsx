'use client';

import { useState } from 'react';
import {
  MapPin,
  Truck,
  Tag,
  Star,
  Plus,
  Trash2,
  Save,
  X,
  Car,
  Phone,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { GooglePlacesAutocomplete, type ParsedAddress } from '@/components/google-places-autocomplete';
import type { Database } from '@/types/database';

type PickupLocation = Database['public']['Tables']['pickup_locations']['Row'];
type DeliveryZone = Database['public']['Tables']['delivery_zones']['Row'];
type DiscountCode = Database['public']['Tables']['discount_codes']['Row'];
type LoyaltySettings = Database['public']['Tables']['loyalty_settings']['Row'];

interface SettingsManagementProps {
  initialPickupLocations: PickupLocation[];
  initialDeliveryZones: DeliveryZone[];
  initialDiscountCodes: DiscountCode[];
  initialLoyaltySettings: LoyaltySettings | null;
}

export function SettingsManagement({
  initialPickupLocations,
  initialDeliveryZones,
  initialDiscountCodes,
  initialLoyaltySettings,
}: SettingsManagementProps) {
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery' | 'discounts' | 'loyalty'>(
    'pickup'
  );
  const [pickupLocations, setPickupLocations] = useState(initialPickupLocations);
  const [deliveryZones, setDeliveryZones] = useState(initialDeliveryZones);
  const [discountCodes, setDiscountCodes] = useState(initialDiscountCodes);
  const [loyaltySettings, setLoyaltySettings] = useState(initialLoyaltySettings);

  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, string | number>>({});

  const supabase = createClient();

  const [parsedAddress, setParsedAddress] = useState<ParsedAddress | null>(null);

  // Pickup Locations
  const handlePlaceSelected = (address: ParsedAddress) => {
    setParsedAddress(address);
    setNewItem((prev) => ({
      ...prev,
      address: address.street_address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    }));
  };

  const handleAddPickupLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('pickup_locations')
        .insert({
          name: newItem.name as string,
          address: newItem.address as string,
          city: newItem.city as string,
          state: (newItem.state as string) || 'GA',
          zip_code: newItem.zip_code as string,
          pickup_time: newItem.pickup_time as string,
          driver_name: (newItem.driver_name as string) || null,
          driver_phone: (newItem.driver_phone as string) || null,
          driver_car_description: (newItem.driver_car_description as string) || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setPickupLocations([...pickupLocations, data]);
      setIsAdding(false);
      setNewItem({});
      setParsedAddress(null);
    } catch (error) {
      console.error('Error adding pickup location:', error);
      alert('Failed to add pickup location');
    }
  };

  const handleDeletePickupLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pickup location?')) return;
    try {
      const { error } = await supabase.from('pickup_locations').delete().eq('id', id);
      if (error) throw error;
      setPickupLocations(pickupLocations.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Error deleting pickup location:', error);
      alert('Failed to delete pickup location');
    }
  };

  const handleTogglePickupActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('pickup_locations')
        .update({ is_active: !currentActive })
        .eq('id', id);
      if (error) throw error;
      setPickupLocations(
        pickupLocations.map((l) => (l.id === id ? { ...l, is_active: !currentActive } : l))
      );
    } catch (error) {
      console.error('Error toggling pickup location:', error);
    }
  };

  // Delivery Zones
  const handleAddDeliveryZone = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .insert({
          zip_code: newItem.zip_code as string,
          delivery_fee: Number(newItem.delivery_fee) || 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setDeliveryZones([...deliveryZones, data]);
      setIsAdding(false);
      setNewItem({});
    } catch (error) {
      console.error('Error adding delivery zone:', error);
      alert('Failed to add delivery zone');
    }
  };

  const handleDeleteDeliveryZone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery zone?')) return;
    try {
      const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
      if (error) throw error;
      setDeliveryZones(deliveryZones.filter((z) => z.id !== id));
    } catch (error) {
      console.error('Error deleting delivery zone:', error);
      alert('Failed to delete delivery zone');
    }
  };

  // Discount Codes
  const handleAddDiscountCode = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .insert({
          code: (newItem.code as string).toUpperCase(),
          discount_type: newItem.discount_type as 'percentage' | 'fixed',
          discount_value: Number(newItem.discount_value),
          minimum_order_amount: Number(newItem.minimum_order_amount) || null,
          max_uses: Number(newItem.max_uses) || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setDiscountCodes([...discountCodes, data]);
      setIsAdding(false);
      setNewItem({});
    } catch (error) {
      console.error('Error adding discount code:', error);
      alert('Failed to add discount code');
    }
  };

  const handleDeleteDiscountCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;
    try {
      const { error } = await supabase.from('discount_codes').delete().eq('id', id);
      if (error) throw error;
      setDiscountCodes(discountCodes.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting discount code:', error);
      alert('Failed to delete discount code');
    }
  };

  const handleToggleDiscountActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentActive })
        .eq('id', id);
      if (error) throw error;
      setDiscountCodes(
        discountCodes.map((c) => (c.id === id ? { ...c, is_active: !currentActive } : c))
      );
    } catch (error) {
      console.error('Error toggling discount code:', error);
    }
  };

  // Loyalty Settings
  const handleSaveLoyaltySettings = async () => {
    try {
      const updates = {
        points_per_dollar: Number(loyaltySettings?.points_per_dollar) || 1,
        points_redemption_rate: Number(loyaltySettings?.points_redemption_rate) || 100,
        is_active: loyaltySettings?.is_active ?? true,
      };

      if (loyaltySettings?.id) {
        const { error } = await supabase
          .from('loyalty_settings')
          .update(updates)
          .eq('id', loyaltySettings.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('loyalty_settings')
          .insert(updates)
          .select()
          .single();
        if (error) throw error;
        setLoyaltySettings(data);
      }
      alert('Loyalty settings saved!');
    } catch (error) {
      console.error('Error saving loyalty settings:', error);
      alert('Failed to save loyalty settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage locations, zones, and discount codes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === 'pickup' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pickup')}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Pickup Locations
        </Button>
        <Button
          variant={activeTab === 'delivery' ? 'default' : 'outline'}
          onClick={() => setActiveTab('delivery')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Delivery Zones
        </Button>
        <Button
          variant={activeTab === 'discounts' ? 'default' : 'outline'}
          onClick={() => setActiveTab('discounts')}
        >
          <Tag className="h-4 w-4 mr-2" />
          Discount Codes
        </Button>
        <Button
          variant={activeTab === 'loyalty' ? 'default' : 'outline'}
          onClick={() => setActiveTab('loyalty')}
        >
          <Star className="h-4 w-4 mr-2" />
          Loyalty Program
        </Button>
      </div>

      {/* Pickup Locations */}
      {activeTab === 'pickup' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pickup Locations</h2>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>

          {isAdding && (
            <Card className="border-emerald">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Location Name"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <div>
                    <GooglePlacesAutocomplete
                      onPlaceSelected={handlePlaceSelected}
                      onClear={() => {
                        setParsedAddress(null);
                        setNewItem((prev) => {
                          const { address, city, state, zip_code, ...rest } = prev;
                          return rest;
                        });
                      }}
                      placeholder="Search for pickup address..."
                    />
                    {parsedAddress && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {parsedAddress.street_address}, {parsedAddress.city}, {parsedAddress.state} {parsedAddress.zip_code}
                      </p>
                    )}
                  </div>
                  <Input
                    placeholder="Pickup Times (e.g., 5:00 PM - 7:00 PM)"
                    value={newItem.pickup_time || ''}
                    onChange={(e) => setNewItem({ ...newItem, pickup_time: e.target.value })}
                  />
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Driver Info (optional)</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Driver Name"
                        value={newItem.driver_name || ''}
                        onChange={(e) => setNewItem({ ...newItem, driver_name: e.target.value })}
                      />
                      <Input
                        placeholder="Driver Phone"
                        value={newItem.driver_phone || ''}
                        onChange={(e) => setNewItem({ ...newItem, driver_phone: e.target.value })}
                      />
                      <Input
                        placeholder="Car Description"
                        value={newItem.driver_car_description || ''}
                        onChange={(e) => setNewItem({ ...newItem, driver_car_description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddPickupLocation}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setNewItem({}); setParsedAddress(null); }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {pickupLocations.map((location) => (
              <Card key={location.id} className={!location.is_active ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{location.name}</h3>
                        {!location.is_active && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {location.address}, {location.city}, {location.state} {location.zip_code}
                      </p>
                      <p className="text-sm text-muted-foreground">{location.pickup_time}</p>
                      {(location.driver_name || location.driver_phone || location.driver_car_description) && (
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                          {location.driver_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> {location.driver_name}
                            </span>
                          )}
                          {location.driver_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {location.driver_phone}
                            </span>
                          )}
                          {location.driver_car_description && (
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" /> {location.driver_car_description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePickupActive(location.id, location.is_active ?? false)}
                      >
                        {location.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePickupLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Zones */}
      {activeTab === 'delivery' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Delivery Zones ({deliveryZones.length} ZIP codes)</h2>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Zone
            </Button>
          </div>

          {isAdding && (
            <Card className="border-emerald">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="ZIP Code"
                    value={newItem.zip_code || ''}
                    onChange={(e) => setNewItem({ ...newItem, zip_code: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Delivery Fee"
                    value={newItem.delivery_fee || ''}
                    onChange={(e) => setNewItem({ ...newItem, delivery_fee: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddDeliveryZone}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setNewItem({}); }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b">
                      <th className="text-left py-2">ZIP Code</th>
                      <th className="text-left py-2">Delivery Fee</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone) => (
                      <tr key={zone.id} className="border-b last:border-0">
                        <td className="py-2 font-mono">{zone.zip_code}</td>
                        <td className="py-2">${(zone.delivery_fee ?? 0).toFixed(2)}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              zone.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {zone.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeliveryZone(zone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Discount Codes */}
      {activeTab === 'discounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Discount Codes</h2>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
              <Plus className="h-4 w-4 mr-2" />
              Add Code
            </Button>
          </div>

          {isAdding && (
            <Card className="border-emerald">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Code (e.g., SAVE10)"
                    value={newItem.code || ''}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                  />
                  <select
                    className="px-3 py-2 border rounded-lg"
                    value={newItem.discount_type || 'percentage'}
                    onChange={(e) => setNewItem({ ...newItem, discount_type: e.target.value })}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Discount Value"
                    value={newItem.discount_value || ''}
                    onChange={(e) => setNewItem({ ...newItem, discount_value: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Min Order Amount (optional)"
                    value={newItem.minimum_order_amount || ''}
                    onChange={(e) => setNewItem({ ...newItem, minimum_order_amount: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max Uses (optional)"
                    value={newItem.max_uses || ''}
                    onChange={(e) => setNewItem({ ...newItem, max_uses: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddDiscountCode}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setNewItem({}); }}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {discountCodes.map((code) => (
              <Card key={code.id} className={!code.is_active ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        {!code.is_active && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {code.discount_type === 'percentage'
                          ? `${code.discount_value}% off`
                          : `$${code.discount_value} off`}
                        {code.minimum_order_amount && ` (min $${code.minimum_order_amount})`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Used: {code.current_uses || 0}
                        {code.max_uses && ` / ${code.max_uses}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleDiscountActive(code.id, code.is_active ?? false)}
                      >
                        {code.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDiscountCode(code.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loyalty Settings */}
      {activeTab === 'loyalty' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Loyalty Program Settings</h2>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Loyalty Program</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to earn and redeem points
                  </p>
                </div>
                <Button
                  variant={loyaltySettings?.is_active ? 'default' : 'outline'}
                  onClick={() =>
                    setLoyaltySettings((prev) => ({
                      ...prev!,
                      is_active: !prev?.is_active,
                    }))
                  }
                >
                  {loyaltySettings?.is_active ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Points Per Dollar</label>
                  <Input
                    type="number"
                    value={loyaltySettings?.points_per_dollar || 1}
                    onChange={(e) =>
                      setLoyaltySettings((prev) => ({
                        ...prev!,
                        points_per_dollar: Number(e.target.value),
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points earned per dollar spent
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Points Redemption Rate</label>
                  <Input
                    type="number"
                    value={loyaltySettings?.points_redemption_rate || 100}
                    onChange={(e) =>
                      setLoyaltySettings((prev) => ({
                        ...prev!,
                        points_redemption_rate: Number(e.target.value),
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Points needed to redeem $1
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveLoyaltySettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Loyalty Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
