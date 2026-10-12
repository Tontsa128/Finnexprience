import type { MetadataRoute } from "next";
import { saloAreas, saloCategories } from "@/lib/salo-directory";
import { saloListings } from "@/lib/salo-listings";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const locales = ["es", "fi", "en"] as const;
type Locale = (typeof locales)[number];

function localizedPagePaths(slug: string) {
  return {
    es: `/${slug}`,
    fi: `/fi/${slug}`,
    en: `/en/${slug}`,
  } satisfies Record<Locale, string>;
}

function localizedDestinationPaths(slug: string) {
  return {
    es: `/salo/destinos/${slug}`,
    fi: `/fi/salo/kohteet/${slug}`,
    en: `/en/salo/destinations/${slug}`,
  } satisfies Record<Locale, string>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://finnexprience.vercel.app").replace(/\/$/, "");
  const staticPaths = ["/", "/experiencias", "/destinos", "/planifica", "/salo"];
  const localizedStaticPaths = ["/fi", "/fi/experiencias", "/fi/destinos", "/fi/planifica", "/fi/salo", "/en", "/en/experiencias", "/en/destinos", "/en/planifica", "/en/salo"];
  const saloPaths = (localePrefix: string) => [
    ...saloCategories.map(({ slug }) => `${localePrefix}/salo/${slug}`),
    ...saloAreas.map(({ slug }) => `${localePrefix}/salo/${slug}`),
    ...saloListings.map(({ category, slug }) => `${localePrefix}/salo/${category}/${slug}`),
  ];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [...new Set([
    ...staticPaths,
    ...localizedStaticPaths,
    ...saloPaths(""),
    ...saloPaths("/fi"),
    ...saloPaths("/en"),
  ])].map((path) => ({
    url: base + path,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.endsWith("/salo") ? 0.9 : 0.7,
  }));

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const [{ data: pages }, { data: destinations }] = await Promise.all([
      supabase.from("pages").select("slug,updated_at").eq("published", true),
      supabase.from("destinations").select("slug,updated_at").eq("published", true),
    ]);

    for (const page of pages ?? []) {
      const paths = localizedPagePaths(page.slug);
      const languages = Object.fromEntries(locales.map((locale) => [locale, base + paths[locale]]));
      for (const locale of locales) {
        entries.push({
          url: base + paths[locale],
          lastModified: page.updated_at ? new Date(page.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: { languages },
        });
      }
    }

    for (const destination of destinations ?? []) {
      const paths = localizedDestinationPaths(destination.slug);
      const languages = Object.fromEntries(locales.map((locale) => [locale, base + paths[locale]]));
      for (const locale of locales) {
        entries.push({
          url: base + paths[locale],
          lastModified: destination.updated_at ? new Date(destination.updated_at) : now,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: { languages },
        });
      }
    }
  }

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
