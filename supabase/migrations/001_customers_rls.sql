-- Enable RLS on customers table (if not already enabled)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own customer record
CREATE POLICY "Users can read own customer record"
ON customers
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Policy: Users can update their own customer record
CREATE POLICY "Users can update own customer record"
ON customers
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Policy: Allow insert during signup (auth_user_id must match)
CREATE POLICY "Users can insert own customer record"
ON customers
FOR INSERT
TO authenticated
WITH CHECK (auth_user_id = auth.uid());

-- Policy: Admins can read all customer records
CREATE POLICY "Admins can read all customers"
ON customers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.auth_user_id = auth.uid()
    AND c.role = 'admin'
  )
);

-- Policy: Staff can read all customer records
CREATE POLICY "Staff can read all customers"
ON customers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM customers c
    WHERE c.auth_user_id = auth.uid()
    AND c.role IN ('admin', 'kitchen', 'marketing')
  )
);
