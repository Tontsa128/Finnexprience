import { defaultContent, type SiteContent } from "./content";
import { createSupabaseServerClient } from "./supabase-server";

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultContent;
  const { data } = await supabase.from("site_settings").select("value").eq("key", "homepage").maybeSingle();
  const value = data?.value as Partial<SiteContent> | null;
  if (!value) return defaultContent;
  return {
    ...defaultContent,
    ...value,
    slides: Array.isArray(value.slides) && value.slides.length ? value.slides as SiteContent["slides"] : defaultContent.slides
  };
}