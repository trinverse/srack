
-- Migration to create menu requests table
CREATE TABLE IF NOT EXISTS public.menu_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    customer_id UUID REFERENCES public.customers(id),
    customer_name TEXT,
    customer_phone TEXT,
    request_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' -- pending, reviewed, added
);

-- Enable RLS
ALTER TABLE public.menu_requests ENABLE ROW LEVEL SECURITY;

-- Policy for customers to insert their own requests
CREATE POLICY "Customers can create requests" ON public.menu_requests
    FOR INSERT WITH CHECK (true);

-- Policy for admins to view all requests
CREATE POLICY "Admins can view all requests" ON public.menu_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = auth.uid() AND customers.role = 'admin'
        )
    );
