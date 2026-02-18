-- Migration: Enable RLS on tables flagged by Supabase security linter
-- Tables: menu_settings, discount_codes, loyalty_settings, audit_logs, email_subscribers
-- Reference: docs/vulnerabilities.md (rls_disabled_in_public)

-- Helper function: check if current user has a staff/admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.customers
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'kitchen', 'marketing')
  );
$$;

-- =============================================================================
-- 1. menu_settings
--    Read: public (anonymous visitors check if menu/ordering is active)
--    Write: admin only
-- =============================================================================
ALTER TABLE public.menu_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu settings"
ON public.menu_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert menu settings"
ON public.menu_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update menu settings"
ON public.menu_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete menu settings"
ON public.menu_settings FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- 2. discount_codes
--    Read: authenticated users (customers validate codes at checkout, admins manage)
--    Write: admin only
-- =============================================================================
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active discount codes"
ON public.discount_codes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert discount codes"
ON public.discount_codes FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update discount codes"
ON public.discount_codes FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete discount codes"
ON public.discount_codes FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- 3. loyalty_settings
--    Read: authenticated users (may display loyalty info to customers)
--    Write: admin only
-- =============================================================================
ALTER TABLE public.loyalty_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read loyalty settings"
ON public.loyalty_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert loyalty settings"
ON public.loyalty_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update loyalty settings"
ON public.loyalty_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete loyalty settings"
ON public.loyalty_settings FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- 4. audit_logs
--    Read: admin only
--    Insert: authenticated users (system writes on behalf of users)
--    Update/Delete: nobody (audit logs are immutable)
-- =============================================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- No UPDATE or DELETE policies — audit logs are immutable

-- =============================================================================
-- 5. email_subscribers
--    Read: admin only
--    Insert: anyone (anonymous visitors can subscribe via popup)
--    Update/Delete: admin only
-- =============================================================================
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read email subscribers"
ON public.email_subscribers FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can subscribe to email"
ON public.email_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update email subscribers"
ON public.email_subscribers FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete email subscribers"
ON public.email_subscribers FOR DELETE
TO authenticated
USING (public.is_admin());
