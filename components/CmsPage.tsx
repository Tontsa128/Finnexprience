import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import type { Locale } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type CmsPageRecord = {
  slug: string;
  title_es: string;
  title_en: string;
  title_fi: string;
  content_es: string;
  content_en: string;
  content_fi: string;
  hero_image: string | null;
};

export default async function CmsPage({ slug, locale }: { slug: string; locale: Locale }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("pages")
    .select("slug,title_es,title_en,title_fi,content_es,content_en,content_fi,hero_image")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) notFound();

  const page = data as CmsPageRecord;
  const title = locale === "fi" ? page.title_fi : locale === "en" ? page.title_en : page.title_es;
  const content = locale === "fi" ? page.content_fi : locale === "en" ? page.content_en : page.content_es;
  const imageUrl = (() => {
    if (!page.hero_image) return null;
    if (page.hero_image.startsWith("/")) return page.hero_image;
    try {
      const parsed = new URL(page.hero_image);
      return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
    } catch {
      return null;
    }
  })();

  return <>
    <Header />
    <main className="pt-24">
      <section className="relative overflow-hidden bg-pine text-white">
        {imageUrl && <Image src={imageUrl} alt={title || "Finnexprience"} fill priority sizes="100vw" className="object-cover opacity-45" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071915]/90 via-[#071915]/65 to-[#071915]/25" />
        <div className="container-site relative py-20 md:py-28">
          <div className="eyebrow text-[#e8b28f]">Finnexprience</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{title}</h1>
        </div>
      </section>
      <article className="container-site max-w-4xl py-14 md:py-20">
        <div className="whitespace-pre-wrap text-base leading-8 text-black/70 md:text-lg">{content}</div>
      </article>
    </main>
    <footer className="border-t border-black/10 py-8"><div className="container-site text-sm text-black/50">© 2026 Finnexprience</div></footer>
  </>;
}
