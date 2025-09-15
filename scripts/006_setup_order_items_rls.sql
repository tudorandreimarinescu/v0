-- Setup RLS policies for order_items table

-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their own orders
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (
        (auth.uid() = orders.user_id) OR 
        (auth.jwt() ->> 'email' = orders.guest_email)
      )
    )
  );

-- Users can insert order items for their own orders
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (
        (auth.uid() = orders.user_id) OR 
        (orders.user_id IS NULL AND orders.guest_email IS NOT NULL)
      )
    )
  );

-- Admin policies for order items
CREATE POLICY "order_items_admin_select_all"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "order_items_admin_update_all"
  ON public.order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
