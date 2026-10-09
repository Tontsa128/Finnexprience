import Link from "next/link";
import Header from "@/components/Header";
import type { Locale } from "@/lib/content";
import { localizedSaloPath, saloAreas, saloCategories, saloCopy } from "@/lib/salo-directory";

export default function SaloDirectory({ locale = "es", categorySlug, itemSlug }: { locale?: Locale; categorySlug?: string; itemSlug?: string }) {
  const t = saloCopy[locale];
  const category = saloCategories.find((entry) => entry.slug === categorySlug);
  const area = saloAreas.find((entry) => entry.slug === itemSlug);
  const title = itemSlug && area && category ? `${category.title[locale]} · ${area.name[locale]}` : category ? category.title[locale] : t.title;
  const description = itemSlug && area && category ? `${area.description[locale]} ${category.description[locale]}` : category ? category.description[locale] : t.intro;
  const cards = categorySlug ? saloAreas : saloCategories;
  const backHref = localizedSaloPath(locale, "/salo");

  return <>
    <Header />
    <main className="pt-24">
      <section className="relative overflow-hidden bg-pine text-white">
        <img src={category?.image ?? (area?.image ?? "/images/hero-archipelago.svg")} alt={locale === "fi" ? "Salon seudun rannikko ja luonto" : locale === "es" ? "Costa y naturaleza de la región de Salo" : "Coast and nature in the Salo region"} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071915]/90 via-[#071915]/65 to-[#071915]/25" />
        <div className="container-site relative py-20 md:py-28">
          <div className="eyebrow text-[#e8b28f]">{t.eyebrow}</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
          {categorySlug && <Link href={backHref} className="mt-8 inline-flex rounded-full border border-white/50 px-5 py-3 font-bold hover:bg-white hover:text-ink">← {t.back}</Link>}
        </div>
      </section>

      <section className="container-site py-16 md:py-20">
        <div className="max-w-3xl">
          <div className="eyebrow text-copper">{categorySlug ? t.areas : t.browse}</div>
          {!categorySlug && <h2 className="mt-3 font-display text-3xl md:text-4xl">{t.areas}</h2>}
          <p className="mt-4 leading-7 text-black/60">{t.notice}</p>
        </div>
        {itemSlug && area && category ? (
          <div className="mt-10 max-w-3xl rounded-[1.75rem] border border-black/10 bg-white p-7 md:p-10">
            <div className="eyebrow text-copper">{category.title[locale]}</div>
            <h2 className="mt-3 font-display text-3xl">{area.name[locale]}</h2>
            <p className="mt-4 leading-7 text-black/65">{area.description[locale]}</p>
            <p className="mt-6 rounded-2xl bg-[#f7f7f3] p-5 text-sm leading-6 text-black/65">{t.providerPending}</p>
            <Link href={localizedSaloPath(locale, `/salo/${category.slug}`)} className="mt-7 inline-flex font-extrabold text-pine">← {t.back}</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((entry) => {
              const href = categorySlug
                ? localizedSaloPath(locale, `/salo/${categorySlug}/${entry.slug}`)
                : localizedSaloPath(locale, `/salo/${entry.slug}`);
              const cardTitle = "title" in entry ? entry.title[locale] : entry.name[locale];
              const cardDescription = entry.description[locale];
              return <Link key={entry.slug} href={href} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-[#e9efe9]">
                  <img src={entry.image} alt={cardTitle} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-ink">{categorySlug ? "SALON SEUTU" : ("icon" in entry ? entry.icon : "")}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{cardTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{cardDescription}</p>
                  <span className="mt-6 inline-flex font-extrabold text-pine">{t.details} →</span>
                </div>
              </Link>;
            })}
          </div>
        )}
      </section>
    </main>
    <footer className="border-t border-black/10 py-8"><div className="container-site text-sm text-black/50">© 2026 Finnexprience · {t.notice}</div></footer>
  </>;
}
