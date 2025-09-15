-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_email text,
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) not null,
  shipping_address jsonb,
  billing_address jsonb,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure either user_id or guest_email is provided
  constraint orders_user_or_guest check (
    (user_id is not null and guest_email is null) or
    (user_id is null and guest_email is not null)
  )
);

-- Enable RLS
alter table public.orders enable row level security;

-- Users can view their own orders
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

-- Users can insert their own orders
create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Allow guest orders (no user_id required)
create policy "orders_insert_guest"
  on public.orders for insert
  with check (user_id is null and guest_email is not null);

-- Admins can view and manage all orders
create policy "orders_admin_all"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
