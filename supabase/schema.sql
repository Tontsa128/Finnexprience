create extension if not exists pgcrypto;

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_es text not null default '',
  title_en text not null default '',
  title_fi text not null default '',
  content_es text not null default '',
  content_en text not null default '',
  content_fi text not null default '',
  hero_image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_es text not null default '',
  alt_en text not null default '',
  alt_fi text not null default '',
  eyebrow_es text not null default '',
  eyebrow_en text not null default '',
  eyebrow_fi text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;
alter table site_settings enable row level security;
alter table pages enable row level security;
alter table hero_slides enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

drop policy if exists "public can read published pages" on pages;
create policy "public can read published pages" on pages for select using (published = true or public.is_admin());

drop policy if exists "public can read active hero slides" on hero_slides;
create policy "public can read active hero slides" on hero_slides for select using (active = true or public.is_admin());

drop policy if exists "public can read settings" on site_settings;
create policy "public can read settings" on site_settings for select using (true);

create policy "admins manage pages" on pages for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage hero slides" on hero_slides for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into site_settings(key,value)
values ('homepage','{"heroTitle":{"es":"Descubre la Finlandia auténtica.","en":"Discover authentic Finland.","fi":"Löydä aito Suomi."},"heroText":{"es":"Saunas junto al lago, cabañas, archipiélago, naturaleza y pequeños lugares que convierten un viaje en un recuerdo.","en":"Lake saunas, cottages, archipelago, nature and small places that turn a trip into a lasting memory.","fi":"Järvisaunat, mökit, saaristo, luonto ja pienet paikat, jotka tekevät matkasta muiston."},"ctaPrimary":{"es":"Planifica mi viaje","en":"Plan my trip","fi":"Suunnittele matkani"},"ctaSecondary":{"es":"Explorar experiencias","en":"Explore experiences","fi":"Tutustu elämyksiin"}}'::jsonb)
on conflict(key) do nothing;

-- After creating your Supabase Auth user, add it here:
-- insert into admin_users(user_id,email) values ('AUTH-USER-UUID','you@example.com');

-- Storage: create a public bucket called media in the Supabase dashboard.
-- The admin UI should upload only after the signed-in user has passed is_admin().
