-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.order_items enable row level security;

-- Users can view order items for their own orders
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

-- Users can insert order items for their own orders
create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

-- Allow guest order items
create policy "order_items_insert_guest"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id is null
    )
  );

-- Admins can manage all order items
create policy "order_items_admin_all"
  on public.order_items for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
