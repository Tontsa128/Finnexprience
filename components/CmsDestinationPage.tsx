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
  provider_url: string | null;
  category: string;
  parent_id: string | null;
  gallery_urls: string[] | null;
  image_alt_es: string;
  image_alt_en: string;
  image_alt_fi: string;
};

export default async function CmsDestinationPage({ locale, slug }: { locale: Locale; slug: string }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("destinations")
    .select("id,slug,name_es,name_en,name_fi,region,description_es,description_en,description_fi,image_url,provider_url,category,parent_id,gallery_urls,image_alt_es,image_alt_en,image_alt_fi")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) notFound();
  const destination = data as Destination;
  const { data: childDestinations } = await supabase
    .from("destinations")
    .select("id,slug,name_es,name_en,name_fi,region,description_es,description_en,description_fi,image_url")
    .eq("parent_id", (data as Destination & { id: string }).id)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  const title = locale === "fi" ? destination.name_fi : locale === "en" ? destination.name_en : destination.name_es;
  const description = locale === "fi" ? destination.description_fi : locale === "en" ? destination.description_en : destination.description_es;
  const t = saloCopy[locale];
  const image = destination.image_url || "/images/hero-summer.svg";
  const imageAlt = (locale === "fi" ? destination.image_alt_fi : locale === "en" ? destination.image_alt_en : destination.image_alt_es) || title || "Finnexprience destination";
  const providerUrl = (() => { try { const url = new URL(destination.provider_url || ""); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null; } catch { return null; } })();

  return <>
    <Header />
    <main className="pt-24">
      <section className="relative overflow-hidden bg-pine text-white">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover opacity-55" />
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
          {providerUrl && <a href={providerUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-pine px-6 py-3 font-extrabold text-white hover:opacity-90">{locale === "fi" ? "Siirry palveluntarjoajan sivuille" : locale === "es" ? "Visitar la web del proveedor" : "Visit provider website"} ↗</a>}
          {(destination.gallery_urls || []).length > 0 && <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {(destination.gallery_urls || []).map((url, index) => <div key={url} className="relative h-40 overflow-hidden rounded-2xl bg-[#e9efe9] md:h-56">
              <Image src={url} alt={title + " · " + (index + 1)} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
            </div>)}
          </div>}
          {childDestinations && childDestinations.length > 0 && <div className="mt-14">
            <div className="eyebrow text-copper">{locale === "fi" ? "Tutustu alueeseen" : locale === "en" ? "Explore this area" : "Descubre la zona"}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{locale === "fi" ? "Kohteet ja alasivut" : locale === "en" ? "Places and subpages" : "Lugares y páginas relacionadas"}</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {childDestinations.map((child: {id:string;slug:string;name_es:string;name_en:string;name_fi:string;region:string;description_es:string;description_en:string;description_fi:string;image_url:string|null}) => {
                const childTitle = locale === "fi" ? child.name_fi : locale === "en" ? child.name_en : child.name_es;
                const childDescription = locale === "fi" ? child.description_fi : locale === "en" ? child.description_en : child.description_es;
                const detailBase = locale === "fi" ? "/fi/salo/kohteet/" : locale === "en" ? "/en/salo/destinations/" : "/salo/destinos/";
                return <Link key={child.id} href={detailBase + child.slug} className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-48 bg-[#e9efe9]">
                    <Image src={child.image_url || "/images/hero-summer.svg"} alt={childTitle || "Finnexprience"} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5"><h3 className="font-display text-2xl">{childTitle}</h3><p className="mt-2 text-sm leading-6 text-black/60">{childDescription}</p><span className="mt-4 inline-flex font-bold text-pine">{locale === "fi" ? "Tutustu" : locale === "en" ? "Explore" : "Descubrir"} →</span></div>
                </Link>;
              })}
            </div>
          </div>}
          <p className="mt-6 text-sm text-black/50">{t.notice}</p>
          <Link href={localizedSaloPath(locale, "/salo")} className="mt-7 inline-flex rounded-full bg-pine px-6 py-3 font-extrabold text-white">{t.back}</Link>
        </div>
      </section>
    </main>
    <footer className="border-t border-black/10 py-8"><div className="container-site text-sm text-black/50">© 2026 Finnexprience · {t.notice}</div></footer>
  </>;
}
