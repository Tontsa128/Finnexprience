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
