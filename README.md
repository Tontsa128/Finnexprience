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
- Create, edit, preview, publish/unpublish and delete pages and destination listings.
- Upload images, write useful alternative text, reorder gallery/hero images and select a cover image.
- Edit Spanish, Finnish and English titles, descriptions, calls to action and SEO metadata.
- Maintain provider name, official website, address/area, categories, source URL, image rights/credit and last-verified date.
- Keep draft changes unpublished until reviewed.
- Provide a preview before publishing and clear feedback when saving fails.

### Current implementation notes
- The admin UI is in `app/admin/page.tsx`.
- Browser-side Supabase configuration is in `lib/supabase-browser.ts`.
- The Salo directory data is currently represented in code in `lib/salo-directory.ts` and `lib/salo-listings.ts`; adding or changing those records currently requires a code update unless/until the CMS data layer is connected.
- The admin page has UI flows for homepage hero-image upload, destination-image upload/preview, multilingual homepage hero text, page editing, destination records and incoming trip requests.
- The admin expects Supabase. A missing-configuration fallback prevents the build from failing, but **does not** make login, database persistence or image upload work by itself.
- Salo destination/area directory entries in `lib/salo-directory.ts` and curated listings in `lib/salo-listings.ts` remain code-managed. CMS destinations in Supabase are a separate data path; confirm the public pages read those CMS records before assuming that editing a record updates every directory page.
- To enable the admin for production, create/configure the Supabase project, apply the required database migrations, configure secure Row Level Security policies and storage policies, and set the environment variables in Vercel. Never commit secrets or expose a `service_role` key in browser code.

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

- Unique localized title and meta description for every indexable page.
- Correct canonical URL and language alternates.
- Useful, descriptive image alt text and responsive image sizes.
- Semantic headings, keyboard-accessible navigation and visible focus states.
- Working sitemap and links that resolve to the correct language route.
- No duplicate or placeholder destination pages indexed as finished editorial content.
- Check mobile layout, image loading, link targets and language switching.

## Roadmap

### Phase 1 — Foundation and release reliability
- [ ] Keep the deployment branch building reliably.
- [ ] Configure Supabase, authentication, database, storage and access policies.
- [ ] Confirm the homepage, admin route and localized routes build and render.

### Phase 2 — Destination directory
- [ ] Complete Salo, Perniö, Mathildedal, Teijo and Särkisalo pages.
- [ ] Add a curated Kemiönsaari section with official provider/destination links.
- [ ] Replace generic placeholder artwork with original or licensed photographs.
- [ ] Verify every external link and record its source.

### Phase 3 — Owner-friendly CMS
- [ ] Connect destination/page records to the database rather than hard-coded arrays.
- [ ] Add secure image upload and image rights/credit fields.
- [ ] Add multilingual editing, draft preview, publish state and SEO fields.
- [ ] Test create/edit/delete flows and confirm data persists after reload.

### Phase 4 — Customer usefulness and business validation
- [ ] Add accommodation cards with provider-verified details and clearly dated prices where available.
- [ ] Add transport, ferry and seasonal-event links that are checked before publication.
- [ ] Test with Spanish-speaking target users and improve the customer journey.
- [ ] Validate provider referral and partner models before making revenue claims.

## Definition of done

A feature is not complete just because its code was committed. It is complete when the relevant build passes, the page is checked in a deployed preview, links and language variants work, content is sourced and legally usable, and any required backend configuration is verified.
