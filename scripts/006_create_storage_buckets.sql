-- Create storage buckets for file uploads
insert into storage.buckets (id, name, public)
values 
  ('products', 'products', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies for products bucket
create policy "products_bucket_select_all"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "products_bucket_admin_all"
  on storage.objects for all
  using (
    bucket_id = 'products' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Set up storage policies for avatars bucket
create policy "avatars_bucket_select_all"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_bucket_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_bucket_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_bucket_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
