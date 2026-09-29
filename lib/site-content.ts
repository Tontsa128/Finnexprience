import { defaultContent, type SiteContent } from "./content";
import { createSupabaseServerClient } from "./supabase-server";

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultContent;

  const [{ data: settings }, { data: dbSlides }] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle(),
    supabase.from("hero_slides").select("*").eq("active", true).order("sort_order")
  ]);

  const value = settings?.value as Partial<SiteContent> | null;
  const slides = (dbSlides ?? []).map((s) => ({
    id: s.id,
    image: s.image_url,
    alt: s.alt_es || "Finnish travel",
    eyebrow: s.eyebrow_es || "Authentic Finland"
  }));

  return {
    ...defaultContent,
    ...value,
    slides: slides.length ? slides : (value?.slides?.length ? value.slides as SiteContent["slides"] : defaultContent.slides)
  };
}