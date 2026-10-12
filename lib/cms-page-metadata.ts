import type { Metadata } from "next";
import type { Locale } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const fallbackDescription: Record<Locale, string> = {
  es: "Descubre Finlandia con Finnexprience.",
  en: "Discover Finland with Finnexprience.",
  fi: "Tutustu Suomeen Finnexpriencen avulla.",
};

export async function getCmsPageMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const suffix = locale;
  const { data } = supabase
    ? await supabase
        .from("pages")
        .select(`slug,title_${suffix},content_${suffix},seo_title_${suffix},seo_description_${suffix}`)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle()
    : { data: null };

  const title = data?.[`seo_title_${suffix}`] || data?.[`title_${suffix}`] || slug.replace(/-/g, " ");
  const plainContent = String(data?.[`content_${suffix}`] || "").replace(/\\s+/g, " ").trim();
  const description = data?.[`seo_description_${suffix}`] || plainContent.slice(0, 160) || fallbackDescription[locale];
  const canonical = (locale === "es" ? "" : "/" + locale) + "/" + slug;
  return {
    title: title + " | Finnexprience",
    description,
    alternates: {
      canonical,
      languages: {
        es: "/" + slug,
        fi: "/fi/" + slug,
        en: "/en/" + slug,
      },
    },
    openGraph: { title: title + " | Finnexprience", description, type: "website", url: canonical },
  };
}
