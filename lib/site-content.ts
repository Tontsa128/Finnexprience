import { defaultContent, type Locale, type SiteContent } from "./content";
import { createSupabaseServerClient } from "./supabase-server";

export async function getSiteContent(locale: Locale = "es"): Promise<SiteContent> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultContent;

  const [{ data: settings }, { data: dbSlides }] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle(),
    supabase.from("hero_slides").select("*").eq("active", true).order("sort_order"),
  ]);

  const value = (settings?.value ?? {}) as Partial<SiteContent>;
  const localizedSlides = (dbSlides ?? []).map((slide) => {
    const alt = locale === "en" ? slide.alt_en : locale === "fi" ? slide.alt_fi : slide.alt_es;
    const eyebrow = locale === "en" ? slide.eyebrow_en : locale === "fi" ? slide.eyebrow_fi : slide.eyebrow_es;
    return {
      id: slide.id,
      image: slide.image_url,
      alt: alt || slide.alt_es || "Finnish travel",
      eyebrow: eyebrow || slide.eyebrow_es || "Authentic Finland",
    };
  });

  const slides = localizedSlides.length > 0
    ? localizedSlides
    : value.slides?.length
      ? value.slides
      : defaultContent.slides;

  return {
    ...defaultContent,
    ...value,
    tagline: { ...defaultContent.tagline, ...(value.tagline ?? {}) },
    heroTitle: { ...defaultContent.heroTitle, ...(value.heroTitle ?? {}) },
    heroText: { ...defaultContent.heroText, ...(value.heroText ?? {}) },
    ctaPrimary: { ...defaultContent.ctaPrimary, ...(value.ctaPrimary ?? {}) },
    ctaSecondary: { ...defaultContent.ctaSecondary, ...(value.ctaSecondary ?? {}) },
    slides,
  };
}
