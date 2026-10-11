import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("destinations").select("name_en,description_en,seo_title_en,seo_description_en").eq("slug", slug).eq("published", true).maybeSingle()
    : { data: null };
  const title = data?.seo_title_en || data?.name_en || slug.replace(/-/g, " ");
  const description = data?.seo_description_en || data?.description_en || "Explore this destination in Finland.";
  const canonical = "/en/salo/destinations/" + slug;
  return {
    title: title + " | Finnexprience",
    description,
    alternates: {
      canonical,
      languages: {
        es: "/salo/destinos/" + slug,
        fi: "/fi/salo/kohteet/" + slug,
        en: "/en/salo/destinations/" + slug,
      },
    },
    openGraph: { title: title + " | Finnexprience", description, type: "website", url: canonical },
  };
}

export default async function EnglishDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="en" slug={slug} />;
}
