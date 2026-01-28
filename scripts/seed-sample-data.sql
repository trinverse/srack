-- Seed script to insert sample data for testing admin reports
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Go to: https://supabase.com/dashboard > Your Project > SQL Editor > New Query

-- =====================================================
-- STEP 1: Insert Menu Items (skip if already exists)
-- =====================================================

INSERT INTO menu_items (name, description, category, has_size_options, price_8oz, price_16oz, single_price, dietary_tags, spice_level, is_active)
SELECT * FROM (VALUES
  ('Paneer Butter Masala', 'Creamy tomato-based curry with soft paneer cubes', 'veg_entrees'::menu_category, true, 8.99::numeric, 14.99::numeric, NULL::numeric, ARRAY['vegetarian']::dietary_tag[], 'medium'::spice_level, true),
  ('Chana Masala', 'Spiced chickpea curry with tomatoes and onions', 'veg_entrees'::menu_category, true, 7.99, 12.99, NULL, ARRAY['vegetarian', 'vegan']::dietary_tag[], 'medium'::spice_level, true),
  ('Aloo Gobi', 'Cauliflower and potato dry curry', 'veg_entrees'::menu_category, true, 7.49, 11.99, NULL, ARRAY['vegetarian', 'vegan', 'gluten_free']::dietary_tag[], 'mild'::spice_level, true),
  ('Palak Paneer', 'Spinach curry with cottage cheese', 'veg_entrees'::menu_category, true, 8.49, 13.99, NULL, ARRAY['vegetarian', 'gluten_free']::dietary_tag[], 'mild'::spice_level, true),
  ('Chicken Tikka Masala', 'Tender chicken in creamy spiced tomato sauce', 'non_veg_entrees'::menu_category, true, 9.99, 16.99, NULL, ARRAY['non_vegetarian']::dietary_tag[], 'medium'::spice_level, true),
  ('Lamb Curry', 'Slow-cooked lamb in aromatic curry sauce', 'non_veg_entrees'::menu_category, true, 11.99, 19.99, NULL, ARRAY['non_vegetarian']::dietary_tag[], 'hot'::spice_level, true),
  ('Chicken Korma', 'Chicken in creamy cashew sauce', 'non_veg_entrees'::menu_category, true, 9.49, 15.99, NULL, ARRAY['non_vegetarian']::dietary_tag[], 'mild'::spice_level, true),
  ('Dal Tadka', 'Yellow lentils tempered with cumin and garlic', 'dal_entrees'::menu_category, true, 6.99, 10.99, NULL, ARRAY['vegetarian', 'vegan', 'gluten_free']::dietary_tag[], 'mild'::spice_level, true),
  ('Dal Makhani', 'Creamy black lentils slow-cooked overnight', 'dal_entrees'::menu_category, true, 7.99, 12.99, NULL, ARRAY['vegetarian']::dietary_tag[], 'mild'::spice_level, true),
  ('Basmati Rice', 'Fragrant long-grain basmati rice', 'roties_rice'::menu_category, false, NULL, NULL, 3.99, ARRAY['vegetarian', 'vegan', 'gluten_free']::dietary_tag[], NULL::spice_level, true),
  ('Jeera Rice', 'Cumin-flavored basmati rice', 'roties_rice'::menu_category, false, NULL, NULL, 4.49, ARRAY['vegetarian', 'vegan', 'gluten_free']::dietary_tag[], NULL, true),
  ('Roti (4 pcs)', 'Fresh whole wheat flatbread', 'roties_rice'::menu_category, false, NULL, NULL, 4.99, ARRAY['vegetarian', 'vegan']::dietary_tag[], NULL, true),
  ('Naan (2 pcs)', 'Soft leavened bread baked in tandoor', 'roties_rice'::menu_category, false, NULL, NULL, 4.49, ARRAY['vegetarian']::dietary_tag[], NULL, true),
  ('Gulab Jamun (4 pcs)', 'Deep-fried milk dumplings in rose syrup', 'special_items'::menu_category, false, NULL, NULL, 5.99, ARRAY['vegetarian']::dietary_tag[], NULL, true),
  ('Raita', 'Yogurt with cucumber and spices', 'special_items'::menu_category, false, NULL, NULL, 2.99, ARRAY['vegetarian', 'gluten_free']::dietary_tag[], NULL, true)
) AS v(name, description, category, has_size_options, price_8oz, price_16oz, single_price, dietary_tags, spice_level, is_active)
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_items.name = v.name);

-- =====================================================
-- STEP 2: Insert Sample Customers (skip if already exists)
-- =====================================================

INSERT INTO customers (full_name, email, phone, notes, role)
SELECT * FROM (VALUES
  ('Priya Sharma', 'priya.sharma@example.com', '4045551234', 'VIP customer. Prefers mild spice. Gate code #1234', 'customer'::user_role),
  ('Rahul Patel', 'rahul.patel@example.com', '4045552345', 'Allergic to nuts. Call before delivery.', 'customer'::user_role),
  ('Anita Desai', 'anita.desai@example.com', '4045553456', 'Leave with concierge if not home', 'customer'::user_role),
  ('Vikram Singh', 'vikram.singh@example.com', '4045554567', NULL::text, 'customer'::user_role),
  ('Meera Gupta', 'meera.gupta@example.com', '4045555678', 'Building requires visitor pass. Ring unit 302.', 'customer'::user_role),
  ('Arjun Kumar', 'arjun.kumar@example.com', '4045556789', 'Regular customer - Thursday deliveries preferred', 'customer'::user_role),
  ('Sonia Reddy', 'sonia.reddy@example.com', '4045557890', NULL, 'customer'::user_role),
  ('Deepak Joshi', 'deepak.joshi@example.com', '4045558901', 'Park in visitor spot #5', 'customer'::user_role)
) AS v(full_name, email, phone, notes, role)
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE customers.email = v.email);

-- =====================================================
-- STEP 3: Insert Monday Delivery Orders (pending/in_progress/ready)
-- =====================================================

DO $$
DECLARE
  cust_priya UUID;
  cust_rahul UUID;
  cust_anita UUID;
  cust_vikram UUID;
  order_id_1 UUID;
  order_id_2 UUID;
  order_id_3 UUID;
  order_id_4 UUID;
  menu_paneer UUID;
  menu_chana UUID;
  menu_chicken UUID;
  menu_dal UUID;
  menu_rice UUID;
  menu_roti UUID;
  menu_naan UUID;
  next_monday DATE;
BEGIN
  -- Get customer IDs
  SELECT id INTO cust_priya FROM customers WHERE email = 'priya.sharma@example.com';
  SELECT id INTO cust_rahul FROM customers WHERE email = 'rahul.patel@example.com';
  SELECT id INTO cust_anita FROM customers WHERE email = 'anita.desai@example.com';
  SELECT id INTO cust_vikram FROM customers WHERE email = 'vikram.singh@example.com';

  -- Get menu item IDs
  SELECT id INTO menu_paneer FROM menu_items WHERE name = 'Paneer Butter Masala';
  SELECT id INTO menu_chana FROM menu_items WHERE name = 'Chana Masala';
  SELECT id INTO menu_chicken FROM menu_items WHERE name = 'Chicken Tikka Masala';
  SELECT id INTO menu_dal FROM menu_items WHERE name = 'Dal Tadka';
  SELECT id INTO menu_rice FROM menu_items WHERE name = 'Basmati Rice';
  SELECT id INTO menu_roti FROM menu_items WHERE name = 'Roti (4 pcs)';
  SELECT id INTO menu_naan FROM menu_items WHERE name = 'Naan (2 pcs)';

  -- Calculate next Monday
  next_monday := CURRENT_DATE + ((8 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7);
  IF next_monday <= CURRENT_DATE THEN
    next_monday := next_monday + 7;
  END IF;

  -- Order 1: Priya (pending)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_building_name, shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_priya, 'SR-MON-' || substr(gen_random_uuid()::text, 1, 6), 'monday', next_monday, 'delivery', 'pending',
    '775 Juniper St NE', 'Apt 325', '30308', 'Atlanta', 'GA',
    'J-5 Building', 'Ask concierge for access. Unit 325',
    32.96, 5.99, 2.64, 41.59, 'paid')
  RETURNING id INTO order_id_1;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_1, menu_paneer, 'Paneer Butter Masala', 1, '16oz', 14.99, 14.99),
    (order_id_1, menu_dal, 'Dal Tadka', 1, '8oz', 6.99, 6.99),
    (order_id_1, menu_rice, 'Basmati Rice', 2, NULL, 3.99, 7.98),
    (order_id_1, menu_naan, 'Naan (2 pcs)', 1, NULL, 4.49, 4.49);

  -- Order 2: Rahul (in_progress)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_building_name, shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_rahul, 'SR-MON-' || substr(gen_random_uuid()::text, 1, 6), 'monday', next_monday, 'delivery', 'in_progress',
    '22 14th St NW', 'Apt 2507', '30309', 'Atlanta', 'GA',
    'The Hue', 'Unit 2507, ask concierge for access. Alt: 470-562-9038',
    38.96, 5.99, 3.12, 48.07, 'paid')
  RETURNING id INTO order_id_2;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_2, menu_chicken, 'Chicken Tikka Masala', 2, '8oz', 9.99, 19.98),
    (order_id_2, menu_chana, 'Chana Masala', 1, '8oz', 7.99, 7.99),
    (order_id_2, menu_roti, 'Roti (4 pcs)', 2, NULL, 4.99, 9.98);

  -- Order 3: Anita (ready)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_gate_code, shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_anita, 'SR-MON-' || substr(gen_random_uuid()::text, 1, 6), 'monday', next_monday, 'delivery', 'ready',
    '2828 Peachtree Rd NW', 'Unit 1902', '30305', 'Atlanta', 'GA',
    '#0357', 'Ask concierge for access. Unit 1902',
    45.95, 5.99, 3.68, 55.62, 'paid')
  RETURNING id INTO order_id_3;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_3, menu_paneer, 'Paneer Butter Masala', 2, '16oz', 14.99, 29.98),
    (order_id_3, menu_dal, 'Dal Tadka', 1, '16oz', 10.99, 10.99),
    (order_id_3, menu_roti, 'Roti (4 pcs)', 1, NULL, 4.99, 4.99);

  -- Order 4: Vikram (pending)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_vikram, 'SR-MON-' || substr(gen_random_uuid()::text, 1, 6), 'monday', next_monday, 'delivery', 'pending',
    '217 Adair Street', 'Unit 4', '30030', 'Decatur', 'GA',
    'Unit 4 (upstairs patio), no gate codes needed',
    35.45, 5.99, 2.84, 44.28, 'paid')
  RETURNING id INTO order_id_4;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_4, menu_chana, 'Chana Masala', 1, '16oz', 12.99, 12.99),
    (order_id_4, menu_chicken, 'Chicken Tikka Masala', 1, '8oz', 9.99, 9.99),
    (order_id_4, menu_rice, 'Basmati Rice', 1, NULL, 3.99, 3.99),
    (order_id_4, menu_naan, 'Naan (2 pcs)', 2, NULL, 4.49, 8.98);
END $$;

-- =====================================================
-- STEP 4: Insert Thursday Delivery Orders
-- =====================================================

DO $$
DECLARE
  cust_meera UUID;
  cust_arjun UUID;
  cust_sonia UUID;
  cust_deepak UUID;
  order_id_1 UUID;
  order_id_2 UUID;
  order_id_3 UUID;
  order_id_4 UUID;
  menu_palak UUID;
  menu_lamb UUID;
  menu_korma UUID;
  menu_dal_makhani UUID;
  menu_jeera_rice UUID;
  menu_roti UUID;
  menu_gulab UUID;
  next_thursday DATE;
BEGIN
  -- Get customer IDs
  SELECT id INTO cust_meera FROM customers WHERE email = 'meera.gupta@example.com';
  SELECT id INTO cust_arjun FROM customers WHERE email = 'arjun.kumar@example.com';
  SELECT id INTO cust_sonia FROM customers WHERE email = 'sonia.reddy@example.com';
  SELECT id INTO cust_deepak FROM customers WHERE email = 'deepak.joshi@example.com';

  -- Get menu item IDs
  SELECT id INTO menu_palak FROM menu_items WHERE name = 'Palak Paneer';
  SELECT id INTO menu_lamb FROM menu_items WHERE name = 'Lamb Curry';
  SELECT id INTO menu_korma FROM menu_items WHERE name = 'Chicken Korma';
  SELECT id INTO menu_dal_makhani FROM menu_items WHERE name = 'Dal Makhani';
  SELECT id INTO menu_jeera_rice FROM menu_items WHERE name = 'Jeera Rice';
  SELECT id INTO menu_roti FROM menu_items WHERE name = 'Roti (4 pcs)';
  SELECT id INTO menu_gulab FROM menu_items WHERE name = 'Gulab Jamun (4 pcs)';

  -- Calculate next Thursday
  next_thursday := CURRENT_DATE + ((11 - EXTRACT(DOW FROM CURRENT_DATE)::int) % 7);
  IF next_thursday <= CURRENT_DATE THEN
    next_thursday := next_thursday + 7;
  END IF;

  -- Order 1: Meera (pending)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_building_name, shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_meera, 'SR-THU-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', next_thursday, 'delivery', 'pending',
    '1301 Spring St NW', 'Unit 1109', '30309', 'Atlanta', 'GA',
    'Mira Midtown', 'Unit 1109, ask concierge for access',
    48.95, 5.99, 3.92, 58.86, 'paid')
  RETURNING id INTO order_id_1;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_1, menu_lamb, 'Lamb Curry', 1, '16oz', 19.99, 19.99),
    (order_id_1, menu_palak, 'Palak Paneer', 1, '16oz', 13.99, 13.99),
    (order_id_1, menu_jeera_rice, 'Jeera Rice', 2, NULL, 4.49, 8.98),
    (order_id_1, menu_gulab, 'Gulab Jamun (4 pcs)', 1, NULL, 5.99, 5.99);

  -- Order 2: Arjun (in_progress)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_arjun, 'SR-THU-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', next_thursday, 'delivery', 'in_progress',
    '1108 Club Trace NE', '30319', 'Atlanta', 'GA',
    'House - leave at front door',
    36.96, 5.99, 2.96, 45.91, 'paid')
  RETURNING id INTO order_id_2;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_2, menu_korma, 'Chicken Korma', 2, '8oz', 9.49, 18.98),
    (order_id_2, menu_dal_makhani, 'Dal Makhani', 1, '8oz', 7.99, 7.99),
    (order_id_2, menu_roti, 'Roti (4 pcs)', 2, NULL, 4.99, 9.98);

  -- Order 3: Sonia (ready)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_apartment, shipping_zip_code, shipping_city, shipping_state,
    shipping_building_name, shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_sonia, 'SR-THU-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', next_thursday, 'delivery', 'ready',
    '77 12th St NE', 'Unit 1514', '30309', 'Atlanta', 'GA',
    '77 on 12th', 'Ask concierge for access. Unit 1514',
    52.94, 5.99, 4.24, 63.17, 'paid')
  RETURNING id INTO order_id_3;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_3, menu_lamb, 'Lamb Curry', 2, '8oz', 11.99, 23.98),
    (order_id_3, menu_palak, 'Palak Paneer', 1, '16oz', 13.99, 13.99),
    (order_id_3, menu_jeera_rice, 'Jeera Rice', 2, NULL, 4.49, 8.98),
    (order_id_3, menu_gulab, 'Gulab Jamun (4 pcs)', 1, NULL, 5.99, 5.99);

  -- Order 4: Deepak (pending)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    shipping_delivery_notes,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_deepak, 'SR-THU-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', next_thursday, 'delivery', 'pending',
    '490 Highbrook Drive NE', '30342', 'Atlanta', 'GA',
    'House. Park in visitor spot #5',
    41.95, 5.99, 3.36, 51.30, 'paid')
  RETURNING id INTO order_id_4;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id_4, menu_korma, 'Chicken Korma', 1, '16oz', 15.99, 15.99),
    (order_id_4, menu_dal_makhani, 'Dal Makhani', 1, '16oz', 12.99, 12.99),
    (order_id_4, menu_roti, 'Roti (4 pcs)', 1, NULL, 4.99, 4.99),
    (order_id_4, menu_jeera_rice, 'Jeera Rice', 1, NULL, 4.49, 4.49);
END $$;

-- =====================================================
-- STEP 5: Insert Completed Orders (for revenue stats)
-- =====================================================

DO $$
DECLARE
  cust_priya UUID;
  cust_rahul UUID;
  cust_anita UUID;
  order_id UUID;
  menu_paneer UUID;
  menu_chicken UUID;
  menu_rice UUID;
BEGIN
  -- Get customer and menu IDs
  SELECT id INTO cust_priya FROM customers WHERE email = 'priya.sharma@example.com';
  SELECT id INTO cust_rahul FROM customers WHERE email = 'rahul.patel@example.com';
  SELECT id INTO cust_anita FROM customers WHERE email = 'anita.desai@example.com';
  SELECT id INTO menu_paneer FROM menu_items WHERE name = 'Paneer Butter Masala';
  SELECT id INTO menu_chicken FROM menu_items WHERE name = 'Chicken Tikka Masala';
  SELECT id INTO menu_rice FROM menu_items WHERE name = 'Basmati Rice';

  -- Completed order 1 (Priya - 10 days ago)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_priya, 'SR-COMP-' || substr(gen_random_uuid()::text, 1, 6), 'monday', CURRENT_DATE - 10, 'delivery', 'completed',
    '775 Juniper St NE', '30308', 'Atlanta', 'GA',
    45.00, 5.99, 3.60, 54.59, 'paid')
  RETURNING id INTO order_id;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id, menu_paneer, 'Paneer Butter Masala', 2, '16oz', 14.99, 29.98),
    (order_id, menu_rice, 'Basmati Rice', 3, NULL, 3.99, 11.97);

  -- Completed order 2 (Rahul - 14 days ago)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_rahul, 'SR-COMP-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', CURRENT_DATE - 14, 'delivery', 'completed',
    '22 14th St NW', '30309', 'Atlanta', 'GA',
    55.00, 5.99, 4.40, 65.39, 'paid')
  RETURNING id INTO order_id;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id, menu_chicken, 'Chicken Tikka Masala', 3, '8oz', 9.99, 29.97),
    (order_id, menu_rice, 'Basmati Rice', 4, NULL, 3.99, 15.96);

  -- Completed order 3 (Anita - 7 days ago)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_anita, 'SR-COMP-' || substr(gen_random_uuid()::text, 1, 6), 'monday', CURRENT_DATE - 7, 'delivery', 'completed',
    '2828 Peachtree Rd NW', '30305', 'Atlanta', 'GA',
    62.00, 5.99, 4.96, 72.95, 'paid')
  RETURNING id INTO order_id;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id, menu_paneer, 'Paneer Butter Masala', 2, '16oz', 14.99, 29.98),
    (order_id, menu_chicken, 'Chicken Tikka Masala', 2, '16oz', 16.99, 33.98);

  -- Completed order 4 (Priya again - 3 days ago)
  INSERT INTO orders (customer_id, order_number, order_day, order_date, order_type, status,
    shipping_street_address, shipping_zip_code, shipping_city, shipping_state,
    subtotal, delivery_fee, tax, total, payment_status)
  VALUES (cust_priya, 'SR-COMP-' || substr(gen_random_uuid()::text, 1, 6), 'thursday', CURRENT_DATE - 3, 'delivery', 'completed',
    '775 Juniper St NE', '30308', 'Atlanta', 'GA',
    38.00, 5.99, 3.04, 47.03, 'paid')
  RETURNING id INTO order_id;

  INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, size, unit_price, total_price) VALUES
    (order_id, menu_paneer, 'Paneer Butter Masala', 1, '16oz', 14.99, 14.99),
    (order_id, menu_chicken, 'Chicken Tikka Masala', 1, '16oz', 16.99, 16.99);
END $$;

-- =====================================================
-- VERIFICATION: Show what was created
-- =====================================================

SELECT 'SEED COMPLETED!' as status;

SELECT 'Menu Items' as table_name, COUNT(*) as count FROM menu_items WHERE is_active = true
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Active Orders (Mon)', COUNT(*) FROM orders WHERE status IN ('pending', 'in_progress', 'ready') AND order_day = 'monday'
UNION ALL
SELECT 'Active Orders (Thu)', COUNT(*) FROM orders WHERE status IN ('pending', 'in_progress', 'ready') AND order_day = 'thursday'
UNION ALL
SELECT 'Completed Orders', COUNT(*) FROM orders WHERE status = 'completed'
UNION ALL
SELECT 'Total Order Items', COUNT(*) FROM order_items;
