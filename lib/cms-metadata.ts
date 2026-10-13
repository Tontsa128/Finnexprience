import type { Metadata } from "next";
import type { Locale } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const fallbackDescriptions: Record<Locale, string> = {
  es: "Descubre Finlandia con Finnexprience.",
  en: "Discover Finland with Finnexprience.",
  fi: "Tutustu Suomeen Finnexpriencen avulla.",
};

const localizedFields: Record<Locale, { title: string; content: string; seoTitle: string; seoDescription: string }> = {
  es: { title: "title_es", content: "content_es", seoTitle: "seo_title_es", seoDescription: "seo_description_es" },
  en: { title: "title_en", content: "content_en", seoTitle: "seo_title_en", seoDescription: "seo_description_en" },
  fi: { title: "title_fi", content: "content_fi", seoTitle: "seo_title_fi", seoDescription: "seo_description_fi" },
};

function excerpt(value: string | null | undefined, fallback: string) {
  const text = (value || "").replace(/<[^>]*>/g, " ").replace(/[#*_\x60>]/g, "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text;
}

export async function getCmsPageMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const path = locale === "es" ? `/${slug}` : `/${locale}/${slug}`;
  const defaults: Metadata = {
    title: `${slug.replace(/-/g, " ")} | Finnexprience`,
    description: fallbackDescriptions[locale],
    alternates: {
      canonical: path,
      languages: { es: `/${slug}`, fi: `/fi/${slug}`, en: `/en/${slug}` },
    },
  };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaults;

  const fields = localizedFields[locale];
  const { data, error } = await supabase
    .from("pages")
    .select(`${fields.title},${fields.content},${fields.seoTitle},${fields.seoDescription}`)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return defaults;
  const record = data as unknown as Record<string, string | null>;
  const title = String(record[fields.seoTitle] || record[fields.title] || defaults.title).trim();
  const description = excerpt(record[fields.seoDescription] || record[fields.content], fallbackDescriptions[locale]);
  return { ...defaults, title, description };
}
