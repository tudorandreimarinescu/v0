-- Setup RLS policies for orders table to support both authenticated users and guest checkout

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_own" ON public.orders;

-- User can view their own orders (both authenticated and guest orders by email)
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    (auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND guest_email IS NOT NULL) OR
    (auth.jwt() ->> 'email' = guest_email)
  );

-- Users can create orders (both authenticated and guest)
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  );

-- Users can update their own orders
CREATE POLICY "orders_update_own"
  ON public.orders FOR UPDATE
  USING (
    (auth.uid() = user_id) OR 
    (auth.jwt() ->> 'email' = guest_email)
  );

-- Admin policies for orders
CREATE POLICY "orders_admin_select_all"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "orders_admin_update_all"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
