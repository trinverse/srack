-- Enable RLS on all tables to resolve security warnings

-- 1. menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON menu_items TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 2. menu_settings
ALTER TABLE menu_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON menu_settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON menu_settings TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 3. pickup_locations
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON pickup_locations FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON pickup_locations TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 4. delivery_zones
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON delivery_zones TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 5. discount_codes
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON discount_codes FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON discount_codes TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 6. email_subscribers
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all users" ON email_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all access for admins" ON email_subscribers TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 7. customer_addresses
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON customer_addresses TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Admins can manage all addresses" ON customer_addresses TO authenticated
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 8. orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own orders" ON orders TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Admins can manage all orders" ON orders TO authenticated
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 9. order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own order items" ON order_items TO authenticated
  USING (order_id IN (SELECT id FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.auth_user_id = auth.uid()))
  WITH CHECK (order_id IN (SELECT id FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.auth_user_id = auth.uid()));
CREATE POLICY "Admins can manage all order items" ON order_items TO authenticated
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 10. loyalty_settings
ALTER TABLE loyalty_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON loyalty_settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON loyalty_settings TO authenticated 
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 11. loyalty_transactions
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own loyalty" ON loyalty_transactions FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Admins can manage all loyalty" ON loyalty_transactions TO authenticated
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 12. audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- 13. carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own carts" ON carts TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- 14. cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart items" ON cart_items TO authenticated
  USING (cart_id IN (SELECT id FROM carts WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())))
  WITH CHECK (cart_id IN (SELECT id FROM carts WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));
