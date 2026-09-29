create extension if not exists pgcrypto;

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

alter table site_settings enable row level security;
alter table pages enable row level security;
alter table hero_slides enable row level security;

create policy "public can read published pages" on pages for select using (published = true);
create policy "public can read active hero slides" on hero_slides for select using (active = true);
create policy "public can read settings" on site_settings for select using (true);

-- For production admin writes, use Supabase Auth + server-side service role
-- or explicit authenticated-owner policies. Never expose the service role key in the browser.
