-- ============================================================
-- Storage policies for menu-images bucket
--
-- Creates the menu-images bucket (if not exists) and sets up
-- RLS policies so:
--   - Anyone can read/download images (public bucket)
--   - Authenticated admin users can upload, update, and delete
-- ============================================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public read access to menu images
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- 3. Allow authenticated admin users to upload menu images
CREATE POLICY "Admin users can upload menu images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.customers
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'kitchen', 'marketing')
  )
);

-- 4. Allow authenticated admin users to update menu images
CREATE POLICY "Admin users can update menu images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.customers
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'kitchen', 'marketing')
  )
);

-- 5. Allow authenticated admin users to delete menu images
CREATE POLICY "Admin users can delete menu images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'menu-images'
  AND EXISTS (
    SELECT 1 FROM public.customers
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'kitchen', 'marketing')
  )
);
