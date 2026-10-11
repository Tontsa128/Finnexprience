import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("destinations").select("name_es,description_es,seo_title_es,seo_description_es").eq("slug", slug).eq("published", true).maybeSingle()
    : { data: null };
  const title = data?.seo_title_es || data?.name_es || slug.replace(/-/g, " ");
  const description = data?.seo_description_es || data?.description_es || "Descubre este destino en la región de Salo, Finlandia.";
  const canonical = "/salo/destinos/" + slug;
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

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="es" slug={slug} />;
}
