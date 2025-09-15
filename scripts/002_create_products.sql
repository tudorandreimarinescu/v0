-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  category text,
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Products are publicly readable
create policy "products_select_all"
  on public.products for select
  using (is_active = true);

-- Only admins can manage products
create policy "products_admin_all"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
