-- Content-builder fields from the travel-site build guide.
-- Safe to run on an existing Supabase project; existing page content is preserved.

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
