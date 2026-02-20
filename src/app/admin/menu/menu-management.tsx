'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Loader2,
  Calendar,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { MenuItem, MenuSetting, MenuCategory, DietaryTag, SpiceLevel, WeeklyMenu } from '@/types/database';
import { getNextWeekday, getISOString, formatDate } from '@/lib/date-utils';

interface MenuManagementProps {
  initialMenuItems: MenuItem[];
  initialSettings: MenuSetting[];
  initialWeeklyMenus: WeeklyMenu[];
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

const dietaryTagOptions: DietaryTag[] = [
  'vegetarian',
  'non_vegetarian',
  'vegan',
  'gluten_free',
  'hot',
  'medium',
  'mild',
];

export function MenuManagement({ initialMenuItems, initialSettings, initialWeeklyMenus }: MenuManagementProps) {
  const supabase = createClient();

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [settings, setSettings] = useState<MenuSetting[]>(initialSettings);
  const [weeklyMenus, setWeeklyMenus] = useState<WeeklyMenu[]>(initialWeeklyMenus);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for new/edit item
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  const menuActive = settings.find(s => s.setting_key === 'menu_active')?.setting_value === 'true';
  const mondayActive = settings.find(s => s.setting_key === 'monday_menu_active')?.setting_value === 'true';
  const thursdayActive = settings.find(s => s.setting_key === 'thursday_menu_active')?.setting_value === 'true';

  const toggleSetting = async (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    if (!setting) return;

    const newValue = setting.setting_value === 'true' ? 'false' : 'true';

    const { error } = await supabase
      .from('menu_settings')
      .update({ setting_value: newValue })
      .eq('setting_key', key);

    if (!error) {
      setSettings(settings.map(s =>
        s.setting_key === key ? { ...s, setting_value: newValue } : s
      ));
    }
  };

  const toggleItemActive = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_active: !item.is_active })
      .eq('id', item.id);

    if (!error) {
      setMenuItems(menuItems.map(m =>
        m.id === item.id ? { ...m, is_active: !m.is_active } : m
      ));
    }
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsCreating(false);
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'veg_entrees',
      has_size_options: true,
      price_8oz: 0,
      price_16oz: 0,
      single_price: 0,
      dietary_tags: [],
      spice_level: null,
      is_active: true,
      is_popular: false,
      sort_order: 0,
    });
    setIsCreating(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
  };

  // Weekly Menu Logic
  const nextMonday = getNextWeekday('Monday');
  const nextThursday = getNextWeekday('Thursday');
  const nextMondayISO = getISOString(nextMonday);
  const nextThursdayISO = getISOString(nextThursday);

  const toggleWeeklyMenu = async (itemId: string, day: 'monday' | 'thursday') => {
    const targetDate = day === 'monday' ? nextMondayISO : nextThursdayISO;
    const existing = weeklyMenus.find(
      wm => wm.menu_item_id === itemId && wm.order_day === day && wm.menu_date === targetDate
    );

    if (existing) {
      // Remove
      const { error } = await supabase
        .from('weekly_menus')
        .delete()
        .eq('id', existing.id);

      if (!error) {
        setWeeklyMenus(weeklyMenus.filter(wm => wm.id !== existing.id));
      }
    } else {
      // Add
      const { data, error } = await supabase
        .from('weekly_menus')
        .insert({
          menu_item_id: itemId,
          order_day: day,
          menu_date: targetDate,
          is_available: true
        })
        .select()
        .single();

      if (!error && data) {
        setWeeklyMenus([...weeklyMenus, data]);
      }
    }
  };

  const isItemSelectedForDay = (itemId: string, day: 'monday' | 'thursday') => {
    const targetDate = day === 'monday' ? nextMondayISO : nextThursdayISO;
    return weeklyMenus.some(
      wm => wm.menu_item_id === itemId && wm.order_day === day && wm.menu_date === targetDate
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('menu_items')
          .insert(formData as MenuItem)
          .select()
          .single();

        if (!error && data) {
          setMenuItems([...menuItems, data]);
          closeForm();
        }
      } else if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', editingItem.id);

        if (!error) {
          setMenuItems(menuItems.map(m =>
            m.id === editingItem.id ? { ...m, ...formData } : m
          ));
          closeForm();
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', item.id);

    if (!error) {
      setMenuItems(menuItems.filter(m => m.id !== item.id));
    }
  };

  const filteredItems = menuItems
    .filter(item =>
      (filterCategory === 'all' || item.category === filterCategory) &&
      (searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const catA = categoryOrder.indexOf(a.category);
      const catB = categoryOrder.indexOf(b.category);
      if (catA !== catB) return catA - catB;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your menu items and settings</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Global Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <button
              onClick={() => toggleSetting('menu_active')}
              className="flex items-center gap-3"
            >
              {menuActive ? (
                <ToggleRight className="h-8 w-8 text-emerald" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Menu Active</p>
                <p className="text-sm text-muted-foreground">
                  {menuActive ? 'Menu is visible to customers' : 'Menu is hidden'}
                </p>
              </div>
            </button>

            <button
              onClick={() => toggleSetting('monday_menu_active')}
              className="flex items-center gap-3"
            >
              {mondayActive ? (
                <ToggleRight className="h-8 w-8 text-emerald" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Monday Orders</p>
                <p className="text-sm text-muted-foreground">
                  {mondayActive ? 'Accepting Monday orders' : 'Monday orders closed'}
                </p>
              </div>
            </button>

            <button
              onClick={() => toggleSetting('thursday_menu_active')}
              className="flex items-center gap-3"
            >
              {thursdayActive ? (
                <ToggleRight className="h-8 w-8 text-gold" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Thursday Orders</p>
                <p className="text-sm text-muted-foreground">
                  {thursdayActive ? 'Accepting Thursday orders' : 'Thursday orders closed'}
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as MenuCategory | 'all')}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              {categoryOrder.map((cat) => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No menu items found</p>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between p-4 border rounded-lg',
                    !item.is_active && 'opacity-50 bg-muted/50'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.is_popular && (
                        <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold-dark rounded-full">
                          Popular
                        </span>
                      )}
                      {!item.is_active && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{categoryLabels[item.category]}</p>
                    <p className="text-sm mt-1">
                      {item.has_size_options
                        ? `8oz: $${item.price_8oz?.toFixed(2)} | 16oz: $${item.price_16oz?.toFixed(2)}`
                        : `$${item.single_price?.toFixed(2)}`}
                    </p>
                    {/* Day Selectors */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'h-7 px-2 text-[10px] uppercase font-bold tracking-wider',
                          isItemSelectedForDay(item.id, 'monday')
                            ? 'bg-emerald text-white border-emerald hover:bg-emerald-dark'
                            : 'text-muted-foreground'
                        )}
                        onClick={() => toggleWeeklyMenu(item.id, 'monday')}
                      >
                        {isItemSelectedForDay(item.id, 'monday') && <Check className="h-3 w-3 mr-1" />}
                        Monday
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'h-7 px-2 text-[10px] uppercase font-bold tracking-wider',
                          isItemSelectedForDay(item.id, 'thursday')
                            ? 'bg-gold text-white border-gold hover:bg-gold-dark'
                            : 'text-muted-foreground'
                        )}
                        onClick={() => toggleWeeklyMenu(item.id, 'thursday')}
                      >
                        {isItemSelectedForDay(item.id, 'thursday') && <Check className="h-3 w-3 mr-1" />}
                        Thursday
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleItemActive(item)}
                    >
                      {item.is_active ? (
                        <ToggleRight className="h-5 w-5 text-emerald" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditForm(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{isCreating ? 'Add Menu Item' : 'Edit Menu Item'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={formData.category || 'veg_entrees'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategory })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {categoryOrder.map((cat) => (
                      <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spice Level</label>
                  <select
                    value={formData.spice_level || ''}
                    onChange={(e) => setFormData({ ...formData, spice_level: (e.target.value || null) as SpiceLevel | null })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">None</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.has_size_options || false}
                    onChange={(e) => setFormData({ ...formData, has_size_options: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium">Has size options (8oz/16oz)</span>
                </label>

                {formData.has_size_options ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">8oz Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_8oz || ''}
                        onChange={(e) => setFormData({ ...formData, price_8oz: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">16oz Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_16oz || ''}
                        onChange={(e) => setFormData({ ...formData, price_16oz: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.single_price || ''}
                      onChange={(e) => setFormData({ ...formData, single_price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dietary Tags</label>
                <div className="flex flex-wrap gap-2">
                  {dietaryTagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.dietary_tags || [];
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter(t => t !== tag)
                          : [...currentTags, tag];
                        setFormData({ ...formData, dietary_tags: newTags });
                      }}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm border transition-colors',
                        formData.dietary_tags?.includes(tag)
                          ? 'bg-emerald text-white border-emerald'
                          : 'bg-white hover:bg-muted'
                      )}
                    >
                      {tag.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_popular || false}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Popular Item</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
