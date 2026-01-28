/**
 * Seed script to insert sample data for testing admin reports
 * Run with: npx tsx scripts/seed-sample-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample customers with delivery addresses
const sampleCustomers = [
  {
    full_name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '4045551234',
    notes: 'VIP customer. Prefers mild spice. Gate code #1234',
  },
  {
    full_name: 'Rahul Patel',
    email: 'rahul.patel@example.com',
    phone: '4045552345',
    notes: 'Allergic to nuts. Call before delivery.',
  },
  {
    full_name: 'Anita Desai',
    email: 'anita.desai@example.com',
    phone: '4045553456',
    notes: 'Leave with concierge if not home',
  },
  {
    full_name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '4045554567',
    notes: null,
  },
  {
    full_name: 'Meera Gupta',
    email: 'meera.gupta@example.com',
    phone: '4045555678',
    notes: 'Building requires visitor pass. Ring unit 302.',
  },
  {
    full_name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '4045556789',
    notes: 'Regular customer - Thursday deliveries preferred',
  },
  {
    full_name: 'Sonia Reddy',
    email: 'sonia.reddy@example.com',
    phone: '4045557890',
    notes: null,
  },
  {
    full_name: 'Deepak Joshi',
    email: 'deepak.joshi@example.com',
    phone: '4045558901',
    notes: 'Park in visitor spot #5',
  },
];

// Sample menu items - mix of sized and single-price items
const sampleMenuItems = [
  // Veg entrees with size options
  {
    name: 'Paneer Butter Masala',
    description: 'Creamy tomato-based curry with soft paneer cubes',
    category: 'veg_entrees',
    has_size_options: true,
    price_8oz: 8.99,
    price_16oz: 14.99,
    dietary_tags: ['vegetarian'],
    spice_level: 'medium',
    is_active: true,
  },
  {
    name: 'Chana Masala',
    description: 'Spiced chickpea curry with tomatoes and onions',
    category: 'veg_entrees',
    has_size_options: true,
    price_8oz: 7.99,
    price_16oz: 12.99,
    dietary_tags: ['vegetarian', 'vegan'],
    spice_level: 'medium',
    is_active: true,
  },
  {
    name: 'Aloo Gobi',
    description: 'Cauliflower and potato dry curry',
    category: 'veg_entrees',
    has_size_options: true,
    price_8oz: 7.49,
    price_16oz: 11.99,
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    spice_level: 'mild',
    is_active: true,
  },
  // Non-veg entrees with size options
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in creamy spiced tomato sauce',
    category: 'non_veg_entrees',
    has_size_options: true,
    price_8oz: 9.99,
    price_16oz: 16.99,
    dietary_tags: ['non_vegetarian'],
    spice_level: 'medium',
    is_active: true,
  },
  {
    name: 'Lamb Curry',
    description: 'Slow-cooked lamb in aromatic curry sauce',
    category: 'non_veg_entrees',
    has_size_options: true,
    price_8oz: 11.99,
    price_16oz: 19.99,
    dietary_tags: ['non_vegetarian'],
    spice_level: 'hot',
    is_active: true,
  },
  // Dal entrees with size options
  {
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with cumin and garlic',
    category: 'dal_entrees',
    has_size_options: true,
    price_8oz: 6.99,
    price_16oz: 10.99,
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    spice_level: 'mild',
    is_active: true,
  },
  {
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight',
    category: 'dal_entrees',
    has_size_options: true,
    price_8oz: 7.99,
    price_16oz: 12.99,
    dietary_tags: ['vegetarian'],
    spice_level: 'mild',
    is_active: true,
  },
  // Roti and rice - single price items
  {
    name: 'Basmati Rice',
    description: 'Fragrant long-grain basmati rice',
    category: 'roties_rice',
    has_size_options: false,
    single_price: 3.99,
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    is_active: true,
  },
  {
    name: 'Jeera Rice',
    description: 'Cumin-flavored basmati rice',
    category: 'roties_rice',
    has_size_options: false,
    single_price: 4.49,
    dietary_tags: ['vegetarian', 'vegan', 'gluten_free'],
    is_active: true,
  },
  {
    name: 'Roti (4 pcs)',
    description: 'Fresh whole wheat flatbread',
    category: 'roties_rice',
    has_size_options: false,
    single_price: 4.99,
    dietary_tags: ['vegetarian', 'vegan'],
    is_active: true,
  },
  {
    name: 'Naan (2 pcs)',
    description: 'Soft leavened bread baked in tandoor',
    category: 'roties_rice',
    has_size_options: false,
    single_price: 4.49,
    dietary_tags: ['vegetarian'],
    is_active: true,
  },
  // Special items
  {
    name: 'Gulab Jamun (4 pcs)',
    description: 'Deep-fried milk dumplings in rose syrup',
    category: 'special_items',
    has_size_options: false,
    single_price: 5.99,
    dietary_tags: ['vegetarian'],
    is_active: true,
  },
];

// Sample delivery addresses (Atlanta area)
const deliveryAddresses = [
  {
    street: '775 Juniper St NE',
    apartment: 'Apt 325',
    zip: '30308',
    city: 'Atlanta',
    building_name: 'J-5 Building',
    gate_code: null,
    delivery_notes: 'Ask concierge for access',
  },
  {
    street: '22 14th St NW',
    apartment: 'Apt 2507',
    zip: '30309',
    city: 'Atlanta',
    building_name: 'The Hue',
    gate_code: null,
    delivery_notes: 'Ask concierge for access',
  },
  {
    street: '2828 Peachtree Rd NW',
    apartment: 'Unit 1902',
    zip: '30305',
    city: 'Atlanta',
    building_name: null,
    gate_code: '#0357',
    delivery_notes: null,
  },
  {
    street: '217 Adair Street',
    apartment: 'Unit 4',
    zip: '30030',
    city: 'Decatur',
    building_name: null,
    gate_code: null,
    delivery_notes: 'Upstairs patio, no gate code needed',
  },
  {
    street: '1301 Spring St NW',
    apartment: 'Unit 1109',
    zip: '30309',
    city: 'Atlanta',
    building_name: 'Mira Midtown',
    gate_code: null,
    delivery_notes: 'Ask concierge for access',
  },
  {
    street: '1108 Club Trace NE',
    apartment: null,
    zip: '30319',
    city: 'Atlanta',
    building_name: null,
    gate_code: null,
    delivery_notes: 'House - leave at front door',
  },
  {
    street: '77 12th St NE',
    apartment: 'Unit 1514',
    zip: '30309',
    city: 'Atlanta',
    building_name: '77 on 12th',
    gate_code: null,
    delivery_notes: 'Ask concierge for access',
  },
  {
    street: '490 Highbrook Drive NE',
    apartment: null,
    zip: '30342',
    city: 'Atlanta',
    building_name: null,
    gate_code: null,
    delivery_notes: 'House',
  },
];

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${timestamp}-${random}`;
}

function getNextMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split('T')[0];
}

function getNextThursday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilThursday = dayOfWeek <= 4 ? (4 - dayOfWeek) : (11 - dayOfWeek);
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + (daysUntilThursday === 0 ? 7 : daysUntilThursday));
  return nextThursday.toISOString().split('T')[0];
}

async function seedData() {
  console.log('Starting seed process...\n');

  // 1. Insert menu items
  console.log('Inserting menu items...');
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .upsert(
      sampleMenuItems.map((item) => ({
        ...item,
        dietary_tags: item.dietary_tags,
      })),
      { onConflict: 'name' }
    )
    .select();

  if (menuError) {
    console.error('Error inserting menu items:', menuError);
  } else {
    console.log(`Inserted/updated ${menuItems?.length || 0} menu items`);
  }

  // Get all menu items for reference
  const { data: allMenuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true);

  if (!allMenuItems || allMenuItems.length === 0) {
    console.error('No menu items found. Cannot create orders.');
    process.exit(1);
  }

  // 2. Insert customers
  console.log('\nInserting customers...');
  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .upsert(sampleCustomers, { onConflict: 'email' })
    .select();

  if (customerError) {
    console.error('Error inserting customers:', customerError);
  } else {
    console.log(`Inserted/updated ${customers?.length || 0} customers`);
  }

  // Get all customers
  const { data: allCustomers } = await supabase.from('customers').select('*');

  if (!allCustomers || allCustomers.length === 0) {
    console.error('No customers found. Cannot create orders.');
    process.exit(1);
  }

  // 3. Create orders with items
  console.log('\nCreating orders...');

  const nextMonday = getNextMonday();
  const nextThursday = getNextThursday();
  const statuses: ('pending' | 'in_progress' | 'ready')[] = ['pending', 'in_progress', 'ready'];

  // Create orders for each customer
  for (let i = 0; i < allCustomers.length; i++) {
    const customer = allCustomers[i];
    const address = deliveryAddresses[i % deliveryAddresses.length];
    const orderDay = i % 2 === 0 ? 'monday' : 'thursday';
    const orderDate = orderDay === 'monday' ? nextMonday : nextThursday;
    const status = statuses[i % statuses.length];

    // Select random menu items for this order
    const numItems = 2 + Math.floor(Math.random() * 3); // 2-4 items per order
    const selectedItems = [...allMenuItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    let subtotal = 0;
    const orderItems: {
      menu_item_id: string;
      item_name: string;
      quantity: number;
      size: string | null;
      unit_price: number;
      total_price: number;
    }[] = [];

    for (const menuItem of selectedItems) {
      const quantity = 1 + Math.floor(Math.random() * 2); // 1-2 quantity
      let unitPrice: number;
      let size: string | null = null;

      if (menuItem.has_size_options) {
        // Randomly choose 8oz or 16oz
        size = Math.random() > 0.5 ? '8oz' : '16oz';
        unitPrice = size === '8oz' ? menuItem.price_8oz! : menuItem.price_16oz!;
      } else {
        unitPrice = menuItem.single_price!;
      }

      const totalPrice = unitPrice * quantity;
      subtotal += totalPrice;

      orderItems.push({
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        quantity,
        size,
        unit_price: unitPrice,
        total_price: totalPrice,
      });
    }

    const deliveryFee = 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        order_number: generateOrderNumber(),
        order_day: orderDay as 'monday' | 'thursday',
        order_date: orderDate,
        order_type: 'delivery',
        status,
        shipping_street_address: address.street,
        shipping_apartment: address.apartment,
        shipping_zip_code: address.zip,
        shipping_city: address.city,
        shipping_state: 'GA',
        shipping_building_name: address.building_name,
        shipping_gate_code: address.gate_code,
        shipping_delivery_notes: address.delivery_notes,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total,
        payment_status: 'paid',
      })
      .select()
      .single();

    if (orderError) {
      console.error(`Error creating order for ${customer.full_name}:`, orderError);
      continue;
    }

    // Insert order items
    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      }))
    );

    if (itemsError) {
      console.error(`Error inserting items for order ${order.order_number}:`, itemsError);
    } else {
      console.log(
        `Created order ${order.order_number} for ${customer.full_name} (${orderDay}, ${status}) with ${orderItems.length} items - $${total.toFixed(2)}`
      );
    }
  }

  // 4. Create some completed orders for revenue stats
  console.log('\nCreating completed orders for revenue stats...');

  for (let i = 0; i < 5; i++) {
    const customer = allCustomers[i % allCustomers.length];
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - (7 + i * 3)); // Past orders

    const orderDay = i % 2 === 0 ? 'monday' : 'thursday';
    const selectedItems = [...allMenuItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let subtotal = 0;
    const orderItems: {
      menu_item_id: string;
      item_name: string;
      quantity: number;
      size: string | null;
      unit_price: number;
      total_price: number;
    }[] = [];

    for (const menuItem of selectedItems) {
      const quantity = 1 + Math.floor(Math.random() * 2);
      let unitPrice: number;
      let size: string | null = null;

      if (menuItem.has_size_options) {
        size = Math.random() > 0.5 ? '8oz' : '16oz';
        unitPrice = size === '8oz' ? menuItem.price_8oz! : menuItem.price_16oz!;
      } else {
        unitPrice = menuItem.single_price!;
      }

      subtotal += unitPrice * quantity;
      orderItems.push({
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        quantity,
        size,
        unit_price: unitPrice,
        total_price: unitPrice * quantity,
      });
    }

    const total = subtotal + 5.99 + subtotal * 0.08;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        order_number: generateOrderNumber(),
        order_day: orderDay as 'monday' | 'thursday',
        order_date: pastDate.toISOString().split('T')[0],
        order_type: 'delivery',
        status: 'completed',
        shipping_street_address: deliveryAddresses[i % deliveryAddresses.length].street,
        shipping_apartment: deliveryAddresses[i % deliveryAddresses.length].apartment,
        shipping_zip_code: deliveryAddresses[i % deliveryAddresses.length].zip,
        shipping_city: 'Atlanta',
        shipping_state: 'GA',
        subtotal,
        delivery_fee: 5.99,
        tax: subtotal * 0.08,
        total,
        payment_status: 'paid',
      })
      .select()
      .single();

    if (!orderError && order) {
      await supabase.from('order_items').insert(
        orderItems.map((item) => ({
          order_id: order.id,
          ...item,
        }))
      );
      console.log(`Created completed order ${order.order_number} for ${customer.full_name} - $${total.toFixed(2)}`);
    }
  }

  console.log('\n--- Seed completed! ---');
  console.log('\nSummary:');
  console.log(`- Menu items: ${allMenuItems.length}`);
  console.log(`- Customers: ${allCustomers.length}`);
  console.log(`- Active orders created for both Monday and Thursday delivery`);
  console.log(`- Completed orders created for revenue statistics`);
  console.log('\nYou can now test the reports at /admin/reports');
}

seedData().catch(console.error);
