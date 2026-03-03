-- ============================================================
-- FIX: Infinite recursion in customers table RLS policies
--
-- Problem: "Admins can read all customers" and "Staff can read
--   all customers" policies query the customers table in their
--   USING clause, which triggers the same policies again,
--   causing error 42P17: infinite recursion.
--
-- Fix: Replace the self-referencing subqueries with the
--   existing SECURITY DEFINER function public.is_admin(),
--   which bypasses RLS when checking the current user's role.
-- ============================================================

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can read all customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can read all customers" ON public.customers;

-- Replace with a single policy using the SECURITY DEFINER function
CREATE POLICY "Staff can read all customers"
ON public.customers
FOR SELECT
TO authenticated
USING (
  public.is_admin()
);
