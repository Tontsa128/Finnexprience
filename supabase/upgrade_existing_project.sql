-- Finnexprience production upgrade script
-- Run once in Supabase Dashboard -> SQL Editor for an EXISTING project.
-- This script is idempotent and safe to rerun.

-- 1) Let an authenticated user read only their own admin allowlist row.
alter table public.admin_users enable row level security;

drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- 2) Add multilingual SEO fields, page hierarchy and visual content blocks.
alter table public.pages
  add column if not exists parent_slug text,
  add column if not exists description_es text not null default '',
  add column if not exists description_en text not null default '',
  add column if not exists description_fi text not null default '',
  add column if not exists blocks_es jsonb not null default '[]'::jsonb,
  add column if not exists blocks_en jsonb not null default '[]'::jsonb,
  add column if not exists blocks_fi jsonb not null default '[]'::jsonb,
  add column if not exists sort_order integer not null default 0;

create index if not exists pages_parent_slug_idx on public.pages(parent_slug);
create index if not exists pages_published_sort_idx on public.pages(published, sort_order);
