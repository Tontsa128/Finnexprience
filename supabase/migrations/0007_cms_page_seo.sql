-- Localized SEO metadata for owner-managed CMS pages.
-- Safe to run on an existing Finnexprience Supabase project.
alter table public.pages
  add column if not exists seo_title_es text not null default '',
  add column if not exists seo_title_en text not null default '',
  add column if not exists seo_title_fi text not null default '',
  add column if not exists seo_description_es text not null default '',
  add column if not exists seo_description_en text not null default '',
  add column if not exists seo_description_fi text not null default '';
