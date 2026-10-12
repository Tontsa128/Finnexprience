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
  seo_title_es text not null default '',
  seo_title_en text not null default '',
  seo_title_fi text not null default '',
  seo_description_es text not null default '',
  seo_description_en text not null default '',
  seo_description_fi text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages
  add column if not exists seo_title_es text not null default '',
  add column if not exists seo_title_en text not null default '',
  add column if not exists seo_title_fi text not null default '',
  add column if not exists seo_description_es text not null default '',
  add column if not exists seo_description_en text not null default '',
  add column if not exists seo_description_fi text not null default '';

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

-- Allow an authenticated user to verify only their own admin membership.
drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

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

-- Storage: create the public media bucket and restrict writes to authenticated admins.
-- Existing uploaded objects remain public because the site uses public image URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read media objects" on storage.objects;
create policy "public can read media objects"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "admins upload media objects" on storage.objects;
create policy "admins upload media objects"
on storage.objects for insert to authenticated
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media objects" on storage.objects;
create policy "admins update media objects"
on storage.objects for update to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media objects" on storage.objects;
create policy "admins delete media objects"
on storage.objects for delete to authenticated
using (bucket_id = 'media' and public.is_admin());


create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null default '',
  name_en text not null default '',
  name_fi text not null default '',
  region text not null default '',
  description_es text not null default '',
  description_en text not null default '',
  description_fi text not null default '',
  image_url text,
  category text not null default 'destination',
  provider_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table destinations add column if not exists provider_url text;
alter table destinations enable row level security;
drop policy if exists "public can read published destinations" on destinations;
create policy "public can read published destinations" on destinations for select using (published = true or public.is_admin());
drop policy if exists "admins manage destinations" on destinations;
create policy "admins manage destinations" on destinations for all using (public.is_admin()) with check (public.is_admin());


create table if not exists trip_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  travel_date text not null,
  interest text not null,
  message text not null,
  locale text not null default 'es' check (locale in ('es','en','fi')),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

alter table trip_requests enable row level security;
drop policy if exists "public can create trip requests" on trip_requests;
create policy "public can create trip requests" on trip_requests
  for insert with check (
    length(email) between 5 and 254
    and length(message) between 10 and 5000
  );
drop policy if exists "admins read trip requests" on trip_requests;
create policy "admins read trip requests" on trip_requests
  for select using (public.is_admin());
drop policy if exists "admins manage trip requests" on trip_requests;
create policy "admins manage trip requests" on trip_requests
  for update using (public.is_admin()) with check (public.is_admin());


-- Destination hierarchy and image gallery for owner-managed cities, villages and subpages.
-- Safe to run on an existing Finnexprience Supabase project.
alter table public.destinations
  add column if not exists parent_id uuid references public.destinations(id) on delete set null,
  add column if not exists gallery_urls jsonb not null default '[]'::jsonb,
  add column if not exists image_alt_es text not null default '',
  add column if not exists image_alt_en text not null default '',
  add column if not exists image_alt_fi text not null default '',
  add column if not exists seo_title_es text not null default '',
  add column if not exists seo_title_en text not null default '',
  add column if not exists seo_title_fi text not null default '',
  add column if not exists seo_description_es text not null default '',
  add column if not exists seo_description_en text not null default '',
  add column if not exists seo_description_fi text not null default '';

create index if not exists destinations_parent_id_idx on public.destinations(parent_id);
create index if not exists destinations_published_sort_idx on public.destinations(published, sort_order);

-- Seed the next four top-level regions. These are editorial starter records, not partner endorsements.
insert into public.destinations
  (slug, name_es, name_en, name_fi, region, description_es, description_en, description_fi, category, provider_url, featured, published, sort_order, image_alt_es, image_alt_en, image_alt_fi)
values
  ('naantali', 'Naantali', 'Naantali', 'Naantali', 'Varsinais-Suomi',
   'Una ciudad costera con un casco antiguo de madera, ambiente de verano y experiencias junto al mar. Consulta la información turística oficial para planificar tu visita.',
   'A coastal town with a wooden old town, a lively summer atmosphere and experiences by the sea. Visit the official tourism source to plan your trip.',
   'Merellinen kesäkaupunki, puutalokortteleita ja elämyksiä meren äärellä. Tarkista ajantasaiset matkailutiedot virallisesta lähteestä.',
   'destination', 'https://www.visitnaantali.com/', true, true, 20,
   'Costa y ambiente de verano en Finlandia', 'Coastline and summer atmosphere in Finland', 'Suomalainen rannikko ja kesätunnelma'),
  ('turku', 'Turku', 'Turku', 'Turku', 'Varsinais-Suomi',
   'Una ciudad junto al río Aura, con historia, cultura, restaurantes y acceso al archipiélago. Comprueba los detalles prácticos en la web turística oficial.',
   'A city on the Aura River with history, culture, restaurants and access to the archipelago. Check practical details with the official tourism website.',
   'Aurajoen varrella sijaitseva kaupunki, jossa yhdistyvät historia, kulttuuri, ravintolat ja saariston läheisyys. Tarkista ajantasaiset tiedot viralliselta matkailusivustolta.',
   'destination', 'https://www.visitturku.fi/', true, true, 30,
   'Inspiración de costa finlandesa', 'Finnish coastal travel inspiration', 'Suomalaisen rannikon matkailuinspiraatio'),
  ('ahvenanmaa', 'Åland', 'Åland Islands', 'Ahvenanmaa', 'Islas Åland',
   'Un destino insular para descubrir paisajes marítimos, pueblos, rutas ciclistas y cultura local. Comprueba conexiones y servicios con fuentes oficiales.',
   'An island destination for maritime scenery, villages, cycling routes and local culture. Verify transport connections and services with official sources.',
   'Saaristokohde, jossa voi tutustua merimaisemiin, kyliin, pyöräilyreitteihin ja paikalliseen kulttuuriin. Tarkista yhteydet ja palvelut virallisista lähteistä.',
   'destination', 'https://www.visitaland.com/', true, true, 40,
   'Inspiración de archipiélago finlandés', 'Finnish archipelago travel inspiration', 'Suomalaisen saariston matkailuinspiraatio'),
  ('hanko', 'Hanko', 'Hanko', 'Hanko', 'Uusimaa',
   'Una ciudad costera conocida por sus playas, villas históricas y ambiente de verano. Consulta la información oficial antes de viajar.',
   'A coastal town known for its beaches, historic villas and summer atmosphere. Check the official tourism information before travelling.',
   'Rantakaupunki, joka tunnetaan hiekkarannoista, historiallisista huviloista ja kesätunnelmasta. Tarkista matkailutiedot virallisesta lähteestä.',
   'destination', 'https://visithanko.fi/', true, true, 50,
   'Inspiración de vacaciones costeras en Finlandia', 'Finnish coastal holiday inspiration', 'Suomalaisen rannikkoloman inspiraatio')
on conflict (slug) do nothing;


-- Media rights and editable hero slides (migration 0006).
-- Content governance fields for image rights and fully editable multilingual hero slides.
-- Safe to run on an existing Finnexprience Supabase project.
alter table public.hero_slides
  add column if not exists source_url text not null default '',
  add column if not exists image_credit text not null default '',
  add column if not exists license_note text not null default '';

alter table public.destinations
  add column if not exists image_source_url text not null default '',
  add column if not exists image_credit text not null default '',
  add column if not exists image_license_note text not null default '',
  add column if not exists content_checked_at date;

create index if not exists hero_slides_active_order_idx
  on public.hero_slides(active, sort_order);
