'use client';

import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import {
  Download,
  ChefHat,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Printer,
  Users,
  Crown,
  Truck,
  ClipboardList,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: Database['public']['Tables']['order_items']['Row'][];
  customers?: { full_name: string | null } | null;
};

type MenuItem = {
  id: string;
  name: string;
  category: Database['public']['Enums']['menu_category'];
  has_size_options: boolean | null;
};

type CustomerLeaderboardEntry = {
  id: string;
  name: string;
  total: number;
  orderCount: number;
};

type DeliveryOrder = {
  id: string;
  order_number: string;
  order_day: Database['public']['Enums']['order_day'];
  order_date: string;
  shipping_street_address: string | null;
  shipping_apartment: string | null;
  shipping_zip_code: string | null;
  shipping_city: string | null;
  shipping_building_name: string | null;
  shipping_gate_code: string | null;
  shipping_delivery_notes: string | null;
  shipping_parking_instructions: string | null;
  order_items: { item_name: string; quantity: number; size: string | null }[];
  customers: { full_name: string; phone: string; notes: string | null } | null;
};

type OrderItemForReport = {
  item_name: string;
  size: string | null;
  quantity: number;
  menu_item_id: string;
  orders: { order_day: Database['public']['Enums']['order_day']; status: string | null } | null;
};

interface ReportsManagementProps {
  weeklyOrders: Order[];
  pendingOrders: Order[];
  menuItems: MenuItem[];
  customerLeaderboard: CustomerLeaderboardEntry[];
  deliveryOrders: DeliveryOrder[];
  allOrderItems: OrderItemForReport[];
}

export function ReportsManagement({
  weeklyOrders,
  pendingOrders,
  menuItems,
  customerLeaderboard,
  deliveryOrders,
  allOrderItems,
}: ReportsManagementProps) {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'sales' | 'customers' | 'delivery' | 'products'>('kitchen');
  const [selectedDay, setSelectedDay] = useState<'monday' | 'thursday' | 'all'>('all');
  const [deliveryDay, setDeliveryDay] = useState<'monday' | 'thursday'>(() => {
    // Default to next delivery day
    const today = new Date();
    const dayOfWeek = today.getDay();
    // If it's Mon-Wed, next delivery is Thursday. If Thu-Sun, next delivery is Monday
    return dayOfWeek >= 4 || dayOfWeek === 0 ? 'monday' : 'thursday';
  });
  const [productDay, setProductDay] = useState<'monday' | 'thursday' | 'all'>('all');

  // Calculate kitchen prep quantities
  const kitchenReport = useMemo(() => {
    const filteredOrders = pendingOrders.filter(
      (order) => selectedDay === 'all' || order.order_day === selectedDay
    );

    const itemQuantities: Record<
      string,
      { name: string; category: string; small: number; large: number }
    > = {};

    filteredOrders.forEach((order) => {
      order.order_items.forEach((item) => {
        const key = item.menu_item_id || item.item_name;
        if (!itemQuantities[key]) {
          const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
          itemQuantities[key] = {
            name: item.item_name,
            category: menuItem?.category || 'unknown',
            small: 0,
            large: 0,
          };
        }
        if (item.size === '8oz') {
          itemQuantities[key].small += item.quantity;
        } else {
          itemQuantities[key].large += item.quantity;
        }
      });
    });

    // Group by category
    const byCategory: Record<
      string,
      { name: string; small: number; large: number }[]
    > = {};
    Object.values(itemQuantities).forEach((item) => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = [];
      }
      byCategory[item.category].push({
        name: item.name,
        small: item.small,
        large: item.large,
      });
    });

    return { itemQuantities, byCategory, totalOrders: filteredOrders.length };
  }, [pendingOrders, selectedDay, menuItems]);

  // Calculate sales statistics
  const salesStats = useMemo(() => {
    const totalRevenue = weeklyOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = weeklyOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by day
    const byDay: Record<string, { count: number; revenue: number }> = {};
    weeklyOrders.forEach((order) => {
      const day = order.order_day || 'unknown';
      if (!byDay[day]) {
        byDay[day] = { count: 0, revenue: 0 };
      }
      byDay[day].count += 1;
      byDay[day].revenue += order.total;
    });

    // Orders by type
    const deliveryOrders = weeklyOrders.filter((o) => o.order_type === 'delivery');
    const pickupOrders = weeklyOrders.filter((o) => o.order_type === 'pickup');

    // Top items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    weeklyOrders.forEach((order) => {
      order.order_items.forEach((item) => {
        const key = item.item_name;
        if (!itemCounts[key]) {
          itemCounts[key] = { name: item.item_name, count: 0, revenue: 0 };
        }
        itemCounts[key].count += item.quantity;
        itemCounts[key].revenue += item.total_price;
      });
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      byDay,
      deliveryOrders: deliveryOrders.length,
      pickupOrders: pickupOrders.length,
      topItems,
    };
  }, [weeklyOrders]);

  // Calculate delivery route data
  const deliveryRouteData = useMemo(() => {
    const filteredOrders = deliveryOrders.filter(
      (order) => order.order_day === deliveryDay
    );

    // Sort by ZIP code first, then by street name for proximity-based routing
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      // First sort by ZIP code
      const zipA = a.shipping_zip_code || '';
      const zipB = b.shipping_zip_code || '';
      if (zipA !== zipB) return zipA.localeCompare(zipB);

      // Then by street name
      const streetA = a.shipping_street_address || '';
      const streetB = b.shipping_street_address || '';
      return streetA.localeCompare(streetB);
    });

    return {
      orders: sortedOrders,
      totalDeliveries: sortedOrders.length,
      uniqueZipCodes: new Set(sortedOrders.map(o => o.shipping_zip_code)).size,
    };
  }, [deliveryOrders, deliveryDay]);

  // Calculate product report data
  const productReportData = useMemo(() => {
    const filteredItems = allOrderItems.filter(
      (item) => productDay === 'all' || item.orders?.order_day === productDay
    );

    const simpleProducts: Record<string, number> = {};
    const productVariations: Record<string, { '8oz': number; '16oz': number }> = {};

    filteredItems.forEach((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menu_item_id);

      if (menuItem?.has_size_options) {
        // Product with size variations
        if (!productVariations[item.item_name]) {
          productVariations[item.item_name] = { '8oz': 0, '16oz': 0 };
        }
        const size = item.size === '8oz' ? '8oz' : '16oz';
        productVariations[item.item_name][size] += item.quantity;
      } else {
        // Simple product (no size options)
        simpleProducts[item.item_name] = (simpleProducts[item.item_name] || 0) + item.quantity;
      }
    });

    // Convert to arrays and sort by quantity
    const simpleProductsList = Object.entries(simpleProducts)
      .map(([name, qty]) => ({ name, quantity: qty }))
      .sort((a, b) => b.quantity - a.quantity);

    const variationsList = Object.entries(productVariations)
      .map(([name, sizes]) => ({ name, small: sizes['8oz'], large: sizes['16oz'] }))
      .sort((a, b) => (b.small + b.large) - (a.small + a.large));

    const totalSimple = simpleProductsList.reduce((sum, p) => sum + p.quantity, 0);
    const totalVariations = variationsList.reduce((sum, p) => sum + p.small + p.large, 0);

    return {
      simpleProducts: simpleProductsList,
      productVariations: variationsList,
      totalSimpleUnits: totalSimple,
      totalVariationUnits: totalVariations,
      totalUniqueProducts: simpleProductsList.length + variationsList.length,
    };
  }, [allOrderItems, productDay, menuItems]);

  const printKitchenReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dayLabel =
      selectedDay === 'all'
        ? 'All Days'
        : selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kitchen Prep Report - ${dayLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          h2 { margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; }
          .total { font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>Kitchen Prep Report</h1>
        <p style="text-align: center;">${dayLabel} - ${format(new Date(), 'MMMM d, yyyy')}</p>
        <p style="text-align: center;">Total Orders: ${kitchenReport.totalOrders}</p>
    `;

    const categoryLabels: Record<string, string> = {
      rice_bowl: 'Rice Bowls',
      curry: 'Curries',
      side: 'Sides',
      bread: 'Breads',
      dessert: 'Desserts',
    };

    Object.entries(kitchenReport.byCategory).forEach(([category, items]) => {
      html += `
        <h2>${categoryLabels[category] || category}</h2>
        <table>
          <tr>
            <th>Item</th>
            <th>8oz</th>
            <th>16oz</th>
            <th>Total</th>
          </tr>
      `;
      items.forEach((item) => {
        html += `
          <tr>
            <td>${item.name}</td>
            <td>${item.small || '-'}</td>
            <td>${item.large || '-'}</td>
            <td class="total">${item.small + item.large}</td>
          </tr>
        `;
      });
      html += '</table>';
    });

    html += '</body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const exportSalesCSV = () => {
    const csvContent = [
      ['Order #', 'Date', 'Customer', 'Type', 'Day', 'Subtotal', 'Discount', 'Delivery Fee', 'Total', 'Status'].join(','),
      ...weeklyOrders.map((order) => [
        order.order_number,
        order.created_at ? format(new Date(order.created_at), 'yyyy-MM-dd HH:mm') : '',
        order.customers?.full_name || 'Guest',
        order.order_type,
        order.order_day,
        order.subtotal.toFixed(2),
        (order.discount_amount ?? 0).toFixed(2),
        (order.delivery_fee ?? 0).toFixed(2),
        order.total.toFixed(2),
        order.status,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDeliveryRouteCSV = () => {
    const dayLabel = deliveryDay.charAt(0).toUpperCase() + deliveryDay.slice(1);
    const csvContent = [
      ['Street/Address', 'Apartment/Floor', 'Zipcode', 'Name', 'Phone', 'Admin Notes'].join(','),
      ...deliveryRouteData.orders.map((order) => {
        // Combine admin notes from order and customer
        const notes = [
          order.shipping_building_name,
          order.shipping_gate_code ? `Gate: ${order.shipping_gate_code}` : null,
          order.shipping_delivery_notes,
          order.shipping_parking_instructions,
          order.customers?.notes,
        ].filter(Boolean).join(' | ');

        return [
          `"${order.shipping_street_address || ''}"`,
          `"${order.shipping_apartment || ''}"`,
          order.shipping_zip_code || '',
          `"${order.customers?.full_name || ''}"`,
          order.customers?.phone || '',
          `"${notes.replace(/"/g, '""')}"`,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-route-${dayLabel}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printDeliveryRoute = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dayLabel = deliveryDay.charAt(0).toUpperCase() + deliveryDay.slice(1);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Delivery Route - ${dayLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
          h1 { text-align: center; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 6px 8px; text-align: left; border: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .notes { font-size: 10px; color: #666; max-width: 200px; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <h1>Delivery Route - ${dayLabel}</h1>
        <p style="text-align: center;">${format(new Date(), 'MMMM d, yyyy')} | Total Deliveries: ${deliveryRouteData.totalDeliveries}</p>
        <table>
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Apt/Unit</th>
            <th>ZIP</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Items</th>
            <th>Notes</th>
          </tr>
    `;

    deliveryRouteData.orders.forEach((order, index) => {
      const notes = [
        order.shipping_building_name,
        order.shipping_gate_code ? `Gate: ${order.shipping_gate_code}` : null,
        order.shipping_delivery_notes,
        order.shipping_parking_instructions,
        order.customers?.notes,
      ].filter(Boolean).join(' | ');

      const items = order.order_items.map(i => `${i.quantity}x ${i.item_name}${i.size ? ` (${i.size})` : ''}`).join(', ');

      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${order.shipping_street_address || '-'}</td>
          <td>${order.shipping_apartment || '-'}</td>
          <td>${order.shipping_zip_code || '-'}</td>
          <td>${order.customers?.full_name || '-'}</td>
          <td>${order.customers?.phone || '-'}</td>
          <td style="font-size: 10px;">${items}</td>
          <td class="notes">${notes || '-'}</td>
        </tr>
      `;
    });

    html += '</table></body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const exportProductsCSV = () => {
    const dayLabel = productDay === 'all' ? 'All Days' : productDay.charAt(0).toUpperCase() + productDay.slice(1);

    let csvContent = `Product Quantity Report - ${dayLabel} - ${format(new Date(), 'yyyy-MM-dd')}\n\n`;

    // Simple Products section
    csvContent += 'SIMPLE PRODUCTS\n';
    csvContent += 'Product Name,Quantity\n';
    productReportData.simpleProducts.forEach((product) => {
      csvContent += `"${product.name}",${product.quantity}\n`;
    });
    csvContent += `Total Simple Products,${productReportData.totalSimpleUnits}\n\n`;

    // Product Variations section
    csvContent += 'PRODUCT VARIATIONS\n';
    csvContent += 'Product Name,Variation,Quantity\n';
    productReportData.productVariations.forEach((product) => {
      if (product.large > 0) {
        csvContent += `"${product.name} - 16oz",16oz,${product.large}\n`;
      }
      if (product.small > 0) {
        csvContent += `"${product.name} - 8oz",8oz,${product.small}\n`;
      }
    });
    csvContent += `Total Variation Products,,${productReportData.totalVariationUnits}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-report-${dayLabel.toLowerCase().replace(' ', '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printProductReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dayLabel = productDay === 'all' ? 'All Days' : productDay.charAt(0).toUpperCase() + productDay.slice(1);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Product Report - ${dayLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          h2 { margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 5px; }
          .two-col { display: flex; gap: 40px; }
          .col { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #e8f5e9; }
          @media print { body { padding: 0; } .two-col { display: block; } .col { margin-bottom: 30px; } }
        </style>
      </head>
      <body>
        <h1>Product Quantity Report</h1>
        <p style="text-align: center;">${dayLabel} - ${format(new Date(), 'MMMM d, yyyy')}</p>
        <p style="text-align: center;">Total Unique Products: ${productReportData.totalUniqueProducts} | Total Units: ${productReportData.totalSimpleUnits + productReportData.totalVariationUnits}</p>

        <div class="two-col">
          <div class="col">
            <h2>Simple Products</h2>
            <table>
              <tr><th>Product Name</th><th>Qty</th></tr>
    `;

    productReportData.simpleProducts.forEach((product) => {
      html += `<tr><td>${product.name}</td><td>${product.quantity}</td></tr>`;
    });
    html += `<tr class="total-row"><td>Total</td><td>${productReportData.totalSimpleUnits}</td></tr>`;

    html += `
            </table>
          </div>
          <div class="col">
            <h2>Product Variations</h2>
            <table>
              <tr><th>Product Name</th><th>Size</th><th>Qty</th></tr>
    `;

    productReportData.productVariations.forEach((product) => {
      if (product.large > 0) {
        html += `<tr><td>${product.name}</td><td>16oz</td><td>${product.large}</td></tr>`;
      }
      if (product.small > 0) {
        html += `<tr><td>${product.name}</td><td>8oz</td><td>${product.small}</td></tr>`;
      }
    });
    html += `<tr class="total-row"><td colspan="2">Total</td><td>${productReportData.totalVariationUnits}</td></tr>`;

    html += `
            </table>
          </div>
        </div>
      </body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Kitchen prep and sales analytics</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTab === 'kitchen' ? 'default' : 'outline'}
          onClick={() => setActiveTab('kitchen')}
        >
          <ChefHat className="h-4 w-4 mr-2" />
          Kitchen
        </Button>
        <Button
          variant={activeTab === 'delivery' ? 'default' : 'outline'}
          onClick={() => setActiveTab('delivery')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Delivery Route
        </Button>
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Products
        </Button>
        <Button
          variant={activeTab === 'sales' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sales')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Sales
        </Button>
        <Button
          variant={activeTab === 'customers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('customers')}
        >
          <Users className="h-4 w-4 mr-2" />
          Customers
        </Button>
      </div>

      {activeTab === 'kitchen' && (
        <div className="space-y-6">
          {/* Kitchen Report Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedDay === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDay('all')}
                  >
                    All Days
                  </Button>
                  <Button
                    variant={selectedDay === 'monday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDay('monday')}
                  >
                    Monday
                  </Button>
                  <Button
                    variant={selectedDay === 'thursday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDay('thursday')}
                  >
                    Thursday
                  </Button>
                </div>
                <Button onClick={printKitchenReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Kitchen Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{kitchenReport.totalOrders}</div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {Object.values(kitchenReport.itemQuantities).reduce(
                    (sum, item) => sum + item.small + item.large,
                    0
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Total Items to Prep</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {Object.keys(kitchenReport.byCategory).length}
                </div>
                <p className="text-sm text-muted-foreground">Categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Kitchen Report by Category */}
          {Object.keys(kitchenReport.byCategory).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No pending orders to prep</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(kitchenReport.byCategory).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {category.replace('_', ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">8oz</th>
                        <th className="text-center py-2">16oz</th>
                        <th className="text-center py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3">{item.name}</td>
                          <td className="text-center py-3">
                            {item.small > 0 ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {item.small}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="text-center py-3">
                            {item.large > 0 ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {item.large}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="text-center py-3 font-bold">
                            {item.small + item.large}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="space-y-6">
          {/* Delivery Route Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Delivery Day:</span>
                  <Button
                    variant={deliveryDay === 'monday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDeliveryDay('monday')}
                  >
                    Monday
                  </Button>
                  <Button
                    variant={deliveryDay === 'thursday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDeliveryDay('thursday')}
                  >
                    Thursday
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportDeliveryRouteCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={printDeliveryRoute}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Route
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-700">
                    {deliveryRouteData.totalDeliveries}
                  </div>
                </div>
                <p className="text-sm text-blue-600">Total Deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="text-3xl font-bold">{deliveryRouteData.uniqueZipCodes}</div>
                </div>
                <p className="text-sm text-muted-foreground">Unique ZIP Codes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold capitalize">{deliveryDay}</div>
                <p className="text-sm text-muted-foreground">Selected Day</p>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Route Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Route - {deliveryDay.charAt(0).toUpperCase() + deliveryDay.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deliveryRouteData.orders.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No deliveries for {deliveryDay}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-2 font-medium">#</th>
                        <th className="text-left py-3 px-2 font-medium">Address</th>
                        <th className="text-left py-3 px-2 font-medium">Apt/Unit</th>
                        <th className="text-left py-3 px-2 font-medium">ZIP</th>
                        <th className="text-left py-3 px-2 font-medium">Customer</th>
                        <th className="text-left py-3 px-2 font-medium">Phone</th>
                        <th className="text-left py-3 px-2 font-medium">Admin Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryRouteData.orders.map((order, index) => {
                        const notes = [
                          order.shipping_building_name,
                          order.shipping_gate_code ? `Gate: ${order.shipping_gate_code}` : null,
                          order.shipping_delivery_notes,
                          order.shipping_parking_instructions,
                          order.customers?.notes,
                        ].filter(Boolean).join(' | ');

                        return (
                          <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="py-3 px-2 font-medium">{index + 1}</td>
                            <td className="py-3 px-2">{order.shipping_street_address || '-'}</td>
                            <td className="py-3 px-2">{order.shipping_apartment || '-'}</td>
                            <td className="py-3 px-2">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                                {order.shipping_zip_code || '-'}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-medium">{order.customers?.full_name || '-'}</td>
                            <td className="py-3 px-2">
                              {order.customers?.phone ? (
                                <a
                                  href={`tel:${order.customers.phone}`}
                                  className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <Phone className="h-3 w-3" />
                                  {order.customers.phone}
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 px-2 text-xs text-muted-foreground max-w-xs truncate" title={notes}>
                              {notes || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Products Report Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Order Day:</span>
                  <Button
                    variant={productDay === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProductDay('all')}
                  >
                    All Days
                  </Button>
                  <Button
                    variant={productDay === 'monday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProductDay('monday')}
                  >
                    Monday
                  </Button>
                  <Button
                    variant={productDay === 'thursday' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProductDay('thursday')}
                  >
                    Thursday
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportProductsCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={printProductReport}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-700">
                  {productReportData.totalSimpleUnits + productReportData.totalVariationUnits}
                </div>
                <p className="text-sm text-emerald-600">Total Units</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{productReportData.totalUniqueProducts}</div>
                <p className="text-sm text-muted-foreground">Unique Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{productReportData.totalSimpleUnits}</div>
                <p className="text-sm text-muted-foreground">Simple Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{productReportData.totalVariationUnits}</div>
                <p className="text-sm text-muted-foreground">Variation Products</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Tables - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simple Products */}
            <Card>
              <CardHeader>
                <CardTitle>Simple Products</CardTitle>
              </CardHeader>
              <CardContent>
                {productReportData.simpleProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No simple products</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Product Name</th>
                        <th className="text-center py-2 w-20">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productReportData.simpleProducts.map((product) => (
                        <tr key={product.name} className="border-b last:border-0">
                          <td className="py-3">{product.name}</td>
                          <td className="text-center py-3">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded font-bold">
                              {product.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/50 font-bold">
                        <td className="py-3">Total</td>
                        <td className="text-center py-3">{productReportData.totalSimpleUnits}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* Product Variations */}
            <Card>
              <CardHeader>
                <CardTitle>Product Variations</CardTitle>
              </CardHeader>
              <CardContent>
                {productReportData.productVariations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No product variations</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Product Name</th>
                        <th className="text-center py-2 w-16">Size</th>
                        <th className="text-center py-2 w-16">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productReportData.productVariations.flatMap((product) => [
                        product.large > 0 && (
                          <tr key={`${product.name}-16oz`} className="border-b last:border-0">
                            <td className="py-2">{product.name}</td>
                            <td className="text-center py-2">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                16oz
                              </span>
                            </td>
                            <td className="text-center py-2 font-bold">{product.large}</td>
                          </tr>
                        ),
                        product.small > 0 && (
                          <tr key={`${product.name}-8oz`} className="border-b last:border-0">
                            <td className="py-2">{product.name}</td>
                            <td className="text-center py-2">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                8oz
                              </span>
                            </td>
                            <td className="text-center py-2 font-bold">{product.small}</td>
                          </tr>
                        ),
                      ].filter(Boolean))}
                      <tr className="bg-muted/50 font-bold">
                        <td className="py-3" colSpan={2}>Total</td>
                        <td className="text-center py-3">{productReportData.totalVariationUnits}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Sales Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">This Week&apos;s Sales</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(startOfWeek(new Date()), 'MMM d')} -{' '}
                    {format(endOfWeek(new Date()), 'MMM d, yyyy')}
                  </p>
                </div>
                <Button onClick={exportSalesCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sales Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <div className="text-3xl font-bold text-emerald-700">
                    ${salesStats.totalRevenue.toFixed(2)}
                  </div>
                </div>
                <p className="text-sm text-emerald-600">Total Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <div className="text-3xl font-bold">{salesStats.totalOrders}</div>
                </div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  ${salesStats.avgOrderValue.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div>
                    <div className="text-xl font-bold">{salesStats.deliveryOrders}</div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                  <div className="border-l pl-4">
                    <div className="text-xl font-bold">{salesStats.pickupOrders}</div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Day */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(salesStats.byDay).map(([day, stats]) => (
                  <div
                    key={day}
                    className="p-4 bg-muted/50 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold capitalize">{day}</p>
                      <p className="text-sm text-muted-foreground">{stats.count} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${stats.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              {salesStats.topItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {salesStats.topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-emerald/10 text-emerald rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-muted-foreground">{item.count} sold</span>
                        <span className="font-semibold">${item.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-700">
                  ${customerLeaderboard.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
                </div>
                <p className="text-sm text-emerald-600">Total Customer Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{customerLeaderboard.length}</div>
                <p className="text-sm text-muted-foreground">Customers with Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  ${customerLeaderboard.length > 0
                    ? (customerLeaderboard.reduce((sum, c) => sum + c.total, 0) / customerLeaderboard.length).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-sm text-muted-foreground">Avg Revenue per Customer</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Spending Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Customer Spending Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerLeaderboard.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No customer data yet</p>
              ) : (
                <div className="space-y-3">
                  {customerLeaderboard.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-amber-100 text-amber-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-medium">{customer.name}</span>
                          <p className="text-sm text-muted-foreground">{customer.orderCount} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 text-lg">
                          ${customer.total.toFixed(2)}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          ${(customer.total / customer.orderCount).toFixed(2)} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Customer Data */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Export Customer Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Download customer spending report as CSV
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const csvContent = [
                      ['Rank', 'Customer Name', 'Total Spent', 'Orders', 'Avg Order Value'].join(','),
                      ...customerLeaderboard.map((customer, index) => [
                        index + 1,
                        `"${customer.name}"`,
                        customer.total.toFixed(2),
                        customer.orderCount,
                        (customer.total / customer.orderCount).toFixed(2),
                      ].join(',')),
                    ].join('\n');

                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `customer-spending-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
