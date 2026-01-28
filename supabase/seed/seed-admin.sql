-- Seed Admin User for The Spice Rack Atlanta
-- Run this in Supabase SQL Editor after creating a user via Auth
--
-- INSTRUCTIONS:
-- 1. First, sign up at /signup or create user in Supabase Auth Dashboard
-- 2. Get the auth user ID from auth.users table
-- 3. Update the auth_user_id below and run this script

-- Option 1: Update an existing customer to admin by email
UPDATE customers
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Option 2: Insert a new admin customer (if customer record doesn't exist)
-- Replace the values below with your actual data
/*
INSERT INTO customers (
  auth_user_id,
  email,
  full_name,
  phone,
  role,
  email_opt_in,
  sms_opt_in
) VALUES (
  'YOUR-AUTH-USER-ID-HERE',  -- Get this from auth.users table
  'admin@example.com',
  'Admin User',
  '555-123-4567',
  'admin',
  true,
  true
) ON CONFLICT (email) DO UPDATE SET role = 'admin';
*/

-- Verify the admin user
SELECT id, email, full_name, role FROM customers WHERE role = 'admin';
