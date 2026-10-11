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
