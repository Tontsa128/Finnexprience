# Finnexprience

**Finnexprience is a multilingual travel discovery website for authentic Finland, starting with Salo and the Southwest Finland coast.** It helps visitors discover places to stay, local food, nature, villages, sauna and seasonal experiences, then sends them to the official provider to check current details and make arrangements directly.

> Business model: destination discovery and provider referral — not the sale or bundling of travel packages by Finnexprience.

## Product vision

Build a polished, trustworthy travel-agency-style discovery experience that inspires international visitors to spend a peaceful one- or two-week holiday in Finland. The initial focus is the Salo region, with carefully selected nearby coastal and archipelago destinations.

- **Primary market:** Spanish-speaking visitors; Spanish is the default language.
- **Languages:** Spanish (`/`), Finnish (`/fi`) and English (`/en`).
- **Initial geography:** Salo and its villages, Perniö, Mathildedal, Teijo National Park, Särkisalo and selected Kemiönsaari destinations.
- **Editorial themes:** Finnish summer, Midsummer (juhannus), lakes and sea, cottages, sauna at sunset, local food, village life, events and slower travel.
- **Revenue model to validate:** provider referrals, clearly disclosed partner placements, lead generation and future provider visibility services. Do not imply a commercial partnership until it has been agreed.
- **Booking boundary:** users are directed to each provider's official website for current prices, availability, terms and booking. Do not collect payment for accommodation or bundle third-party travel services in this project.

## Destination research and official references

These official tourism sources are starting points for research and outbound links. Check each page before publishing a specific claim, event date, opening hour, price, transport schedule or availability.

| Destination / source | Official website | Editorial role |
|---|---|---|
| Visit Salo | https://visitsalo.fi/ | Main destination source for Salo, Teijo, Mathildedal, villages, local events and routes. |
| Visit Mathildedal | https://visitmathildedal.fi/ | The ironworks village, accommodation, local services, arrival information and waterfront experiences. |
| Visit Perniö | https://visitsalo.fi/location/pernio/ | Treat Perniö as a Salo-area destination; verify individual attractions and providers before adding links. |
| Visit Kemiönsaari | https://www.visitkimitoon.fi/fi/ | Nearby archipelago, accommodation, food, events, transport and island experiences. |
| Särkisalo / Särkisalo and the sea | https://visitsalo.fi/en/sarkisalo-and-the-sea/ | Salo's coastal and island village area; verify local services and seasonal availability. |
| Visit Finland | https://www.visitfinland.com/ | National-level inspiration and verified destination/product context. |

Research observations:
- VisitSalo highlights Teijo National Park, Mathildedal Ironworks Village, Teijo and Kirjakkala, Halikko, Särkisalo and the Salo centre.
- Visit Mathildedal provides practical arrival information and describes the village as a coastal destination near Teijo National Park.
- Visit Kemiönsaari provides categories for accommodation, food, activities, nature, sights, events and travel connections.
- Särkisalo's appeal includes coastal nature, islands, beaches, cycling and a relaxed summer harbour atmosphere.
- These facts guide the content plan; they do not grant permission to copy another site's photos, text, branding or design.

## Homepage visual direction and image rights

The homepage has been updated with a photographic hero, stronger location framing, image-led experience cards, and a story section around a slower Finnish summer holiday. The Spanish default remains unchanged, with Finnish and English versions using the same layout and localized copy.

Current inspiration photographs are served from Unsplash's image CDN:
- Sauna interior with lake view: https://unsplash.com/photos/cozy-cabin-with-wood-stove-overlooking-a-serene-lake-j9H1arwi_ao
- Finnish lakeside cottage in forest: https://unsplash.com/photos/a-cabin-sits-among-lush-green-trees-u1rbvJrX2MQ
- Archipelago/sailing inspiration: https://unsplash.com/s/photos/finnish-archipelago

These are inspirational editorial images, not evidence that a pictured building, sauna or view belongs to a specific Salo-region provider. Do not use them as accommodation listing photos or imply that they depict a named partner. Before production launch, confirm image URLs, keep a source/credit record, and replace generic inspiration imagery with approved photographs of the actual destination where available. For performance and reliability, consider moving approved images to managed storage and adding responsive local/CDN variants.

## Customer experience and information architecture

### Main navigation
1. **Inspiration / home:** a cinematic, rotating image hero with stable headline and calls to action.
2. **Destinations:** browse the Salo region and individual area pages.
3. **Experiences:** nature, sauna, local food, coastal routes, village culture and seasonal activities.
4. **Accommodation:** hotels, cottages, villas, distinctive stays and provider links. Display a price only when the source and validity period are clear.
5. **Events and seasons:** summer, Midsummer, markets, Salo evening market, pumpkin events and Christmas markets. Event dates must be checked against an official current source.
6. **Plan your trip:** arrival, local transport, distances, seasonal considerations and links to official timetables.
7. **Provider / destination details:** concise multilingual descriptions, location, image credit where required, last-checked date and official external link.

### Editorial principles
- Use warm, premium, natural visual storytelling — real Finnish summer, waterfront cottages, sauna at sunset and authentic local settings.
- Make the first screen emotionally engaging while keeping navigation and language switching clear.
- Avoid making unsupported promises. Mark prices and schedules as indicative only when appropriate, and direct visitors to the source for current details.
- Do not invent providers, partnerships, ratings, prices, availability, events or booking links.
- Do not reuse third-party photos or text without permission or a suitable licence. Prefer original photographs, provider-approved media and properly licensed assets.
- Every published listing should have a verified official URL, a clear location, Spanish/Finnish/English copy, image alt text, and a content review date.

## Editable content and image management

The goal is for the site owner to manage content without editing source code for routine updates.

### Target admin capabilities
- Secure owner login.
- Create, edit, publish/unpublish and delete pages and destination listings.
- Organize destinations hierarchically: top-level regions → cities/villages → child pages for accommodation, services, events and experiences.
- Upload a cover image and multiple gallery images for each destination or subpage.
- Upload images, write useful alternative text, reorder gallery/hero images and select a cover image.
- Edit Spanish, Finnish and English titles, descriptions, calls to action and SEO metadata.
- Maintain provider name, official website, address/area, categories, source URL, image rights/credit and last-verified date.
- Keep draft changes unpublished until reviewed.
- Provide a preview before publishing and clear feedback when saving fails.

### Current implementation notes
- The admin UI is in `app/admin/page.tsx`.
- Browser-side Supabase configuration is in `lib/supabase-browser.ts`.
- The directory categories, area descriptions and curated listings in `lib/salo-directory.ts` and `lib/salo-listings.ts` are still code-managed. Published CMS destination records from Supabase are shown on the Salo directory landing page and homepage regional cards. Destination records support parent/child hierarchy, gallery image URLs and localized cover-image alt text through migration `supabase/migrations/0005_destination_hierarchy.sql`.
- The admin page supports homepage hero-image upload, destination cover/gallery uploads, parent/child destination selection, multilingual homepage text, editable destination/page records and incoming trip requests. Hero slides can be edited in Spanish, English and Finnish, reordered, activated/deactivated, and given source URL, creator/rights credit and licence notes. CMS pages include a three-language draft preview, URL-slug validation, and localized SEO titles/descriptions. Published CMS page metadata uses those SEO fields when supplied and falls back to the page title/content excerpt. Destination records include image-source, credit/licence and content-review-date fields.
- The admin expects Supabase. A missing-configuration fallback prevents the build from failing, but **does not** make login, database persistence or image upload work by itself.
- Published CMS destinations appear on the Salo directory landing page and have Spanish, Finnish and English detail routes. Destination detail pages display the image credit/source link and content review date when supplied. They do not replace the hard-coded categories, area pages or curated listings. Published admin-managed `pages` records render on `/{slug}`, `/fi/{slug}` and `/en/{slug}` using the matching language fields. Public routes require Supabase configuration and a published record; the admin editor has an internal three-language preview, but there is no public draft-preview URL or CMS-page SEO editor yet.
- To enable the admin for production, configure Supabase and Vercel using the checklist below. Never commit secrets or expose a `service_role` key in browser code.

### Supabase and admin setup checklist

1. Create a Supabase project and open its **SQL Editor**.
2. For a new project, run the complete `supabase/schema.sql` script. For an existing project, run the migrations in order if they have not already been applied: `0005_destination_hierarchy.sql`, `0006_media_rights_and_hero_editor.sql`, then `0007_cms_page_seo.sql` (all in `supabase/migrations/`). Migration 0005 adds parent/child destinations and galleries, and seeds Naantali, Turku, Åland and Hanko. Migration 0006 adds image-source, credit/licence and review-date fields plus hero editor metadata. Migration 0007 adds localized SEO fields for CMS pages. The starter destination records are editorial, not provider partnerships.
3. In Supabase **Authentication → Users**, create the owner login account and copy its user UUID.
4. In the SQL Editor, register that account as an admin. Replace the sample UUID and email with the values from your account:
   ```sql
   insert into public.admin_users (user_id, email)
   values ('AUTH-USER-UUID', 'owner@example.com')
   on conflict (user_id) do update set email = excluded.email;
   ```
5. Add the two public client environment variables below in Vercel for both **Preview** and **Production**. Use the Supabase project URL and its publishable/anon key; never use the service-role key in the browser.
6. Redeploy and test `/admin`: sign in, upload an image, save a change, reload and verify that it persists. Also check that an unauthenticated visitor cannot write to the database or upload/delete media.

If the SQL script reports an error involving Supabase Storage permissions, stop and inspect the error before granting broader privileges. Do not work around a policy error by making all storage writes public.

Required Vercel environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Set them for the relevant Preview and Production environments, then redeploy. Use only the public/anon or publishable browser key; protect database access with authentication and Row Level Security.

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase SSR / Supabase JS for the planned admin, database and storage
- Vercel deployment

## Local development

Requirements: a supported Node.js LTS version and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm run start
```

Before declaring a change complete, check the GitHub Actions result and the matching Vercel deployment. Do not treat a successful compile as proof that every page, authentication flow or database operation works.

## Environment and security

Create a local `.env.local` for development; do not commit it.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use environment-specific Vercel variables for deployment. The public browser key is not a substitute for database security. Use Supabase Auth, Row Level Security and least-privilege policies. Never place a service-role key in a `NEXT_PUBLIC_*` variable.

## SEO and accessibility checklist

- [x] Localized title and meta description for the Spanish, Finnish and English homepages.
- [x] Homepage canonical URLs and language alternates.
- [ ] Add page-specific localized metadata to all destination, experience and CMS routes.
- [ ] Ensure the rendered document language is correct for each locale route (the root layout currently defaults to Spanish).
- Useful, descriptive image alt text and responsive image sizes.
- Semantic headings, keyboard-accessible navigation and visible focus states.
- Working sitemap and links that resolve to the correct language route.
- No duplicate or placeholder destination pages indexed as finished editorial content.
- Check mobile layout, image loading, link targets and language switching.

## Roadmap

### Phase 1 — Foundation and release reliability
- [ ] Keep the deployment branch building reliably; the latest Vercel preview currently cannot be confirmed because the account hit Vercel's free-tier deployment limit (more than 100 deployments in 24 hours). Re-check after the limit resets.
- [ ] Configure Supabase, authentication, database, storage and access policies.
- [ ] Confirm the homepage, admin route and localized routes build and render.

### Phase 2 — Destination directory
- [x] Add Naantali, Turku, Åland and Hanko as initial homepage destination cards, with additional top-level destinations supported from the admin.
- [ ] Complete Salo, Perniö, Mathildedal, Teijo and Särkisalo pages.
- [ ] Add a curated Kemiönsaari section with official provider/destination links.
- [ ] Replace generic placeholder artwork with original or licensed photographs.
- [ ] Verify every external link and record its source.

### Phase 3 — Owner-friendly CMS
- [x] Connect published destination records to the Salo directory and localized destination detail routes.
- [x] Render published admin-managed `pages` records on public localized routes in Spanish, Finnish and English.
- [x] Connect homepage destination cards to published database records.
- [x] Add parent/child destination hierarchy and multi-image galleries to the admin and destination pages.
- [ ] Connect remaining hard-coded category and curated listing arrays to the database.
- [ ] Add secure image upload and image rights/credit fields.
- [ ] Add multilingual hero-slide editing, reordering, active/inactive controls and image alt text.
- [ ] Add multilingual editing, draft preview, publish state and SEO fields.
- [ ] Test create/edit/delete flows and confirm data persists after reload.

### Phase 4 — Customer usefulness and business validation
- [ ] Add accommodation cards with provider-verified details and clearly dated prices where available.
- [ ] Add transport, ferry and seasonal-event links that are checked before publication.
- [ ] Test with Spanish-speaking target users and improve the customer journey.
- [ ] Validate provider referral and partner models before making revenue claims.

## Definition of done

A feature is not complete just because its code was committed. It is complete when the relevant build passes, the page is checked in a deployed preview, links and language variants work, content is sourced and legally usable, and any required backend configuration is verified.
