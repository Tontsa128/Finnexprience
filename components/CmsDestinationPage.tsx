import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import type { Locale } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { localizedSaloPath, saloCopy } from "@/lib/salo-directory";

type Destination = {
  slug: string;
  name_es: string;
  name_en: string;
  name_fi: string;
  region: string;
  description_es: string;
  description_en: string;
  description_fi: string;
  image_url: string | null;
  category: string;
};

export default async function CmsDestinationPage({ locale, slug }: { locale: Locale; slug: string }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("destinations")
    .select("slug,name_es,name_en,name_fi,region,description_es,description_en,description_fi,image_url,category")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) notFound();
  const destination = data as Destination;
  const title = locale === "fi" ? destination.name_fi : locale === "en" ? destination.name_en : destination.name_es;
  const description = locale === "fi" ? destination.description_fi : locale === "en" ? destination.description_en : destination.description_es;
  const t = saloCopy[locale];
  const image = destination.image_url || "/images/hero-summer.svg";

  return <>
    <Header />
    <main className="pt-24">
      <section className="relative overflow-hidden bg-pine text-white">
        <Image src={image} alt={title || "Finnexprience destination"} fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071915]/90 via-[#071915]/65 to-[#071915]/25" />
        <div className="container-site relative py-20 md:py-28">
          <div className="eyebrow text-[#e8b28f]">{destination.region || t.eyebrow}</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
          <Link href={localizedSaloPath(locale, "/salo")} className="mt-8 inline-flex rounded-full border border-white/50 px-5 py-3 font-bold hover:bg-white hover:text-ink">← {t.back}</Link>
        </div>
      </section>
      <section className="container-site py-14 md:py-20">
        <div className="max-w-3xl rounded-[1.75rem] border border-black/10 bg-white p-7 md:p-10">
          <div className="eyebrow text-copper">{t.listings}</div>
          <h2 className="mt-3 font-display text-3xl">{title}</h2>
          <p className="mt-4 leading-7 text-black/65">{description}</p>
          <p className="mt-6 text-sm text-black/50">{t.notice}</p>
          <Link href={localizedSaloPath(locale, "/salo")} className="mt-7 inline-flex rounded-full bg-pine px-6 py-3 font-extrabold text-white">{t.back}</Link>
        </div>
      </section>
    </main>
    <footer className="border-t border-black/10 py-8"><div className="container-site text-sm text-black/50">© 2026 Finnexprience · {t.notice}</div></footer>
  </>;
}
