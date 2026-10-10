import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SaloMap from "@/components/SaloMap";
import type { Locale } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { localizedSaloPath, saloAreas, saloCategories, saloCopy } from "@/lib/salo-directory";
import { listingsForCategory, saloListings } from "@/lib/salo-listings";

export default async function SaloDirectory({ locale = "es", categorySlug, areaSlug, itemSlug }: { locale?: Locale; categorySlug?: string; areaSlug?: string; itemSlug?: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: cmsDestinations } = supabase
    ? await supabase.from("destinations").select("slug,name_es,name_en,name_fi,region,description_es,description_en,description_fi,image_url,featured,category").eq("published", true).order("sort_order", { ascending: true })
    : { data: [] as any[] };
  const publishedDestinations = cmsDestinations ?? [];
  const t = saloCopy[locale];
  const category = saloCategories.find((entry) => entry.slug === categorySlug);
  const area = saloAreas.find((entry) => entry.slug === areaSlug);
  const listing = saloListings.find((entry) => entry.slug === itemSlug && entry.category === categorySlug);
  const title = listing && category ? listing.title[locale] : category ? category.title[locale] : area ? area.name[locale] : t.title;
  const description = listing ? listing.description[locale] : category ? category.description[locale] : area ? area.description[locale] : t.intro;
  const cards = category ? listingsForCategory(category.slug) : saloCategories;
  const backHref = localizedSaloPath(locale, "/salo");

  return <>
    <Header />
    <main className="pt-24">
      <section className="relative overflow-hidden bg-pine text-white">
        <Image src={listing?.image ?? (category?.image ?? area?.image ?? "/images/hero-archipelago.svg")} alt={locale === "fi" ? "Salon seudun rannikko ja luonto" : locale === "es" ? "Costa y naturaleza de la región de Salo" : "Coast and nature in the Salo region"} fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071915]/90 via-[#071915]/65 to-[#071915]/25" />
        <div className="container-site relative py-20 md:py-28">
          <div className="eyebrow text-[#e8b28f]">{t.eyebrow}</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
          {area && <a href={area.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-[#e8b28f] px-6 py-3 font-extrabold text-[#071915] transition hover:bg-white">{locale === "fi" ? "Virallinen matkailusivusto" : locale === "es" ? "Web turística oficial" : "Official tourism website"} ↗</a>}
          {(categorySlug || areaSlug) && <Link href={backHref} className="mt-8 inline-flex rounded-full border border-white/50 px-5 py-3 font-bold hover:bg-white hover:text-ink">← {t.back}</Link>}
        </div>
      </section>

      <section className="container-site py-16 md:py-20">
        <div className="max-w-3xl">
          <div className="eyebrow text-copper">{categorySlug ? t.listings : areaSlug ? t.areas : t.browse}</div>
          {!categorySlug && !areaSlug && <h2 className="mt-3 font-display text-3xl md:text-4xl">{t.areas}</h2>}
          <p className="mt-4 leading-7 text-black/60">{t.notice}</p>
        </div>
        {!listing && <SaloMap locale={locale} />}
        {listing && category ? (
          <div className="mt-10 max-w-3xl rounded-[1.75rem] border border-black/10 bg-white p-7 md:p-10">
            <div className="eyebrow text-copper">{category.title[locale]}</div>
            <h2 className="mt-3 font-display text-3xl">{listing.title[locale]}</h2>
            <p className="mt-4 leading-7 text-black/65">{listing.description[locale]}</p>
            <p className="mt-4 text-sm font-semibold text-black/60">{listing.location[locale]}</p>
            {listing.address && <p className="mt-2 text-sm text-black/60">{listing.address}</p>}
            <div className="mt-6 flex flex-wrap gap-3"><a href={listing.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 font-extrabold text-white hover:opacity-90">{listing.linkLabel[locale]} ↗</a><a href={"https://www.openstreetmap.org/search?query=" + encodeURIComponent(listing.address ?? listing.location[locale])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-pine px-6 py-3 font-extrabold text-pine hover:bg-pine hover:text-white">{t.map} ↗</a></div>
            <Link href={localizedSaloPath(locale, `/salo/${category.slug}`)} className="mt-7 inline-flex font-extrabold text-pine">← {t.back}</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((entry) => {
              const href = categorySlug
                ? localizedSaloPath(locale, `/salo/${categorySlug}/${entry.slug}`)
                : localizedSaloPath(locale, `/salo/${entry.slug}`);
              const cardTitle = entry.title[locale];
              const cardDescription = entry.description[locale];
              return <Link key={entry.slug} href={href} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-[#e9efe9]">
                  <Image src={entry.image} alt={cardTitle} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-ink">{categorySlug ? (category?.title[locale] ?? "SALO") : ("icon" in entry ? entry.icon : "")}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{cardTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{cardDescription}</p>
                  <span className="mt-6 inline-flex font-extrabold text-pine">{categorySlug && "linkLabel" in entry ? entry.linkLabel[locale] : t.details} →</span>
                </div>
              </Link>;
            })}
          </div>
        )}

        {!categorySlug && !areaSlug && !listing && publishedDestinations.length > 0 && <div className="mt-16">
          <div className="max-w-3xl">
            <div className="eyebrow text-copper">{t.listings}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{locale === "fi" ? "Suositellut kohteet" : locale === "es" ? "Destinos seleccionados" : "Featured destinations"}</h2>
            <p className="mt-4 leading-7 text-black/60">{locale === "fi" ? "Kohteet ja esittelyt, jotka on julkaistu Finnexpriencen hallinnassa." : locale === "es" ? "Lugares y descripciones publicados desde el panel de Finnexprience." : "Places and descriptions published from the Finnexprience admin panel."}</p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedDestinations.map((destination: { slug: string; name_es: string; name_en: string; name_fi: string; region: string; description_es: string; description_en: string; description_fi: string; image_url: string | null; featured: boolean }) => {
              const cardTitle = locale === "fi" ? destination.name_fi : locale === "en" ? destination.name_en : destination.name_es;
              const cardDescription = locale === "fi" ? destination.description_fi : locale === "en" ? destination.description_en : destination.description_es;
              const detailPath = locale === "fi" ? "/salo/kohteet/" : locale === "en" ? "/salo/destinations/" : "/salo/destinos/";
              const href = localizedSaloPath(locale, detailPath + destination.slug);
              return <Link key={destination.slug} href={href} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-[#e9efe9]">
                  <Image src={destination.image_url || "/images/hero-summer.svg"} alt={cardTitle || destination.region || "Finnexprience destination"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  {destination.featured && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-ink">{locale === "fi" ? "Suositeltu" : locale === "es" ? "Destacado" : "Featured"}</span>}
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-copper">{destination.region}</p>
                  <h3 className="mt-2 font-display text-2xl">{cardTitle || destination.slug}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{cardDescription}</p>
                  <span className="mt-6 inline-flex font-extrabold text-pine">{t.details} →</span>
                </div>
              </Link>;
            })}
          </div>
        </div>

        {!categorySlug && !areaSlug && !listing && <div className="mt-16">
          <div className="eyebrow text-copper">{t.areas}</div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saloAreas.map((entry) => <Link key={entry.slug} href={localizedSaloPath(locale, `/salo/${entry.slug}`)} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-40 overflow-hidden bg-[#e9efe9]">
                <Image src={entry.image} alt={entry.name[locale]} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5"><h3 className="font-display text-xl">{entry.name[locale]}</h3><p className="mt-2 text-sm leading-6 text-black/60">{entry.description[locale]}</p><span className="mt-4 inline-flex font-extrabold text-pine">{t.details} →</span></div>
            </Link>)}
          </div>
        </div>}
      </section>
    </main>
    <footer className="border-t border-black/10 py-8"><div className="container-site text-sm text-black/50">© 2026 Finnexprience · {t.notice}</div></footer>
  </>;
}
