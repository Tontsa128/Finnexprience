import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CmsPageContent from "@/components/CmsPageContent";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type PageProps = { params: Promise<{ slug: string }> };

async function getPage(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("pages").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPage(slug);
  if (!data) return {};
  return {
    title: data.title_fi || data.title_en || data.title_es || "Finnexprience",
    description: data.description_fi || data.description_en || data.description_es || data.content_fi?.slice(0, 160) || undefined,
    alternates: { canonical: `/fi/${slug}` },
  };
}

export default async function FinnishPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPage(slug);
  if (!data) notFound();

  return <>
    <Header />
    <main className="pt-32">
      <article className="container-site py-16">
        <div className="eyebrow text-copper">Finnexprience</div>
        <h1 className="mt-3 max-w-4xl font-display text-5xl md:text-7xl">{data.title_fi || data.title_en || data.title_es || slug}</h1>
        {data.hero_image && <img src={data.hero_image} alt="" className="mt-10 h-[420px] w-full rounded-[2rem] object-cover" />}
        <CmsPageContent page={data} locale="fi" />
      </article>
    </main>
  </>;
}
