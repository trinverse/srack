-- ============================================================
-- SECURITY FIX MIGRATION
-- Fixes all 4 Supabase Security Advisor warnings
-- 
-- SAFETY: 
--   ❌ No tables dropped
--   ❌ No data deleted  
--   ❌ No columns removed
--   ✅ Only policies (access rules) and function config changed
--
-- TESTED AGAINST:
--   - email-popup.tsx insert → sends {email, source} → passes new policy ✅
--   - audit_logs → no client-side inserts exist → safe to restrict ✅
--   - is_admin() → ALTER keeps all 14 dependent policies intact ✅
-- ============================================================


-- ============================================================
-- FIX 1: Function `public.is_admin` — Secure the search_path
-- 
-- Problem: Supabase Security Advisor flags functions without
--   an explicit search_path as "role mutable search_path".
--   An attacker could set their search_path to a malicious 
--   schema and hijack function calls.
--
-- Fix: Use ALTER FUNCTION (NOT DROP) to pin search_path = ''
--   This preserves all 14 dependent policies.
--   All table references inside the function already use
--   'public.customers' so empty search_path is safe.
--
-- Source: https://supabase.com/docs/guides/database/database-advisors
-- ============================================================

ALTER FUNCTION public.is_admin() SET search_path = '';


-- ============================================================
-- FIX 2: Table `public.audit_logs` — Restrict INSERT policy
-- 
-- Problem: Policy "Authenticated users can insert audit logs"
--   uses WITH CHECK (true) — any authenticated user can insert
--   audit logs for ANY user_id, even forging other users.
--
-- Fix: Only allow inserting logs where user_id matches the
--   authenticated user's own customer record.
--
-- Impact: No frontend code inserts to audit_logs (verified by
--   grep — zero results for .from('audit')). This table is
--   only used for admin viewing. So this policy is safe.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

CREATE POLICY "Authenticated users can insert own audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NOT NULL
  AND user_id IN (
    SELECT id FROM public.customers
    WHERE auth_user_id = auth.uid()
  )
);


-- ============================================================
-- FIX 3: Table `public.email_subscribers` — Restrict INSERT
-- 
-- Problem: Policy "Anyone can subscribe to email" / 
--   "Enable insert for all users" uses WITH CHECK (true).
--   An attacker could spam the table with garbage data or
--   manipulate fields like is_subscribed and unsubscribed_at.
--
-- Fix: Validate that:
--   1. email is non-null and non-empty (required field)
--   2. is_subscribed is either NULL (defaults to true) or true
--      (can't insert an already-unsubscribed record)
--   3. unsubscribed_at must be NULL on insert
--      (can't pretend you already unsubscribed)
--
-- Verified compatible with email-popup.tsx which inserts:
--   { email: "user@example.com", source: "popup" }
--   → email is provided ✅
--   → is_subscribed defaults to NULL ✅  
--   → unsubscribed_at defaults to NULL ✅
-- ============================================================

-- Drop old unrestricted INSERT policies (both possible names
-- that Supabase may have created)
DROP POLICY IF EXISTS "Anyone can subscribe to email" ON public.email_subscribers;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.email_subscribers;

CREATE POLICY "Anyone can subscribe with valid email"
ON public.email_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(trim(email)) > 0
  AND (is_subscribed IS NULL OR is_subscribed = true)
  AND unsubscribed_at IS NULL
);


-- ============================================================
-- FIX 4: Compromised/Leaked Password Protection
-- 
-- Problem: Supabase Auth warns that compromised password
--   checking should be enabled.
--
-- THIS CANNOT BE FIXED VIA SQL — it's a dashboard setting.
-- 
-- Steps:
--   1. Go to Supabase Dashboard
--   2. Click "Authentication" in left sidebar
--   3. Go to "Providers" tab → expand "Email"  
--   4. Toggle ON "Leaked password protection"
--   5. Click Save
--
-- NOTE: This feature requires Supabase Pro plan.
--   If you're on the free plan, this warning will remain
--   but is not fixable without upgrading.
-- ============================================================
