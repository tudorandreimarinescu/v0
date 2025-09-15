-- Function to set custom claims in JWT
create or replace function public.set_claim(uid uuid, claim text, value jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if the user making the request is an admin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Only admins can set claims';
  end if;

  -- Update the user's raw_app_meta_data
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(claim, value)
  where id = uid;

  return 'success';
end;
$$;

-- Function to get user role from JWT claims
create or replace function public.get_user_role(user_id uuid default auth.uid())
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  -- First try to get role from profiles table
  select role into user_role
  from public.profiles
  where id = user_id;

  -- If not found in profiles, check JWT claims
  if user_role is null then
    select coalesce(
      auth.jwt() ->> 'role',
      'user'
    ) into user_role;
  end if;

  return coalesce(user_role, 'user');
end;
$$;

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return get_user_role(user_id) = 'admin';
end;
$$;

-- Function to promote user to admin (can only be called by existing admin)
create or replace function public.promote_to_admin(target_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if the user making the request is an admin
  if not is_admin(auth.uid()) then
    raise exception 'Only admins can promote users';
  end if;

  -- Update the user's role in profiles
  update public.profiles
  set role = 'admin',
      updated_at = now()
  where id = target_user_id;

  -- Also set in JWT claims
  perform set_claim(target_user_id, 'role', '"admin"'::jsonb);

  return 'User promoted to admin successfully';
end;
$$;
