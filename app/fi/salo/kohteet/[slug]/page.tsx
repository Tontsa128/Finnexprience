import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("destinations").select("name_fi,description_fi,seo_title_fi,seo_description_fi").eq("slug", slug).eq("published", true).maybeSingle()
    : { data: null };
  const title = data?.seo_title_fi || data?.name_fi || slug.replace(/-/g, " ");
  const description = data?.seo_description_fi || data?.description_fi || "Tutustu tähän matkailukohteeseen Suomessa.";
  const canonical = "/fi/salo/kohteet/" + slug;
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

export default async function FinnishDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="fi" slug={slug} />;
}
