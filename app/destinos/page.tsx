import Link from "next/link";
import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Locale } from "@/lib/content";

type Destination = {
  slug: string;
  name_es: string;
  name_en: string;
  name_fi: string;
  description_es: string;
  description_en: string;
  description_fi: string;
  image_url: string | null;
};

const fallbackDestinations: Destination[] = [
  { slug:"salo", name_es:"Salo", name_en:"Salo", name_fi:"Salo", description_es:"Costa, naturaleza y auténtica vida local del suroeste de Finlandia.", description_en:"Coast, nature and authentic local life in Southwest Finland.", description_fi:"Rannikkoa, luontoa ja aitoa paikallista elämää Lounais-Suomessa.", image_url:"/images/hero-archipelago.svg" },
  { slug:"mathildedal", name_es:"Mathildedal", name_en:"Mathildedal", name_fi:"Mathildedal", description_es:"Un pequeño pueblo lleno de historia, naturaleza y encanto.", description_en:"A small village filled with history, nature and character.", description_fi:"Pieni kylä, joka on täynnä historiaa, luontoa ja tunnelmaa.", image_url:"/images/hero-summer.svg" },
  { slug:"teijo", name_es:"Teijo", name_en:"Teijo", name_fi:"Teijo", description_es:"Bosques, lagos y senderos para respirar la Finlandia tranquila.", description_en:"Forests, lakes and trails for experiencing peaceful Finland.", description_fi:"Metsiä, järviä ja polkuja rauhallisen Suomen kokemiseen.", image_url:"/images/hero-sauna.svg" },
];

const copy: Record<Locale, { eyebrow:string; title:string; text:string; discover:string }> = {
  es: { eyebrow:"Destinos", title:"Lugares que merecen ser vividos.", text:"Empezamos en Salo, Mathildedal y Teijo. La plataforma está preparada para crecer por todo el suroeste de Finlandia y, después, por todo el país.", discover:"Descubrir →" },
  en: { eyebrow:"Destinations", title:"Places worth experiencing.", text:"We start in Salo, Mathildedal and Teijo. The platform is built to grow across Southwest Finland and, later, the rest of the country.", discover:"Discover →" },
  fi: { eyebrow:"Kohteet", title:"Paikkoja, jotka kannattaa kokea.", text:"Aloitamme Salosta, Mathildedalista ja Teijosta. Alusta on valmis kasvamaan koko Lounais-Suomeen ja myöhemmin muualle Suomeen.", discover:"Tutustu →" },
};

function localizedPath(locale: Locale, slug: string) {
  return locale === "es" ? "/" + slug : "/" + locale + "/" + slug;
}

function localizedName(destination: Destination, locale: Locale) {
  if (locale === "en") return destination.name_en || destination.name_es || destination.slug;
  if (locale === "fi") return destination.name_fi || destination.name_es || destination.slug;
  return destination.name_es || destination.slug;
}

function localizedDescription(destination: Destination, locale: Locale) {
  if (locale === "en") return destination.description_en || destination.description_es || "";
  if (locale === "fi") return destination.description_fi || destination.description_es || "";
  return destination.description_es || "";
}

export default async function DestinosPage({ locale = "es" }: { locale?: Locale }) {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from("destinations").select("*").eq("published", true).order("sort_order")
    : { data: null };

  const destinations = (data as Destination[] | null) ?? fallbackDestinations;
  const t = copy[locale];

  return <>
    <Header />
    <main className="pt-32">
      <section className="container-site py-16">
        <div className="eyebrow text-copper">{t.eyebrow}</div>
        <h1 className="mt-3 max-w-4xl font-display text-5xl md:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{t.text}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => {
            const name = localizedName(destination, locale);
            const description = localizedDescription(destination, locale);
            return <Link href={localizedPath(locale, destination.slug)} key={destination.slug} className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
              <img src={destination.image_url || "/images/hero-summer.svg"} alt={name} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"/>
              <div className="p-6"><h2 className="font-display text-3xl">{name}</h2><p className="mt-3 text-black/60">{description}</p><span className="mt-6 inline-block font-bold text-pine">{t.discover}</span></div>
            </Link>;
          })}
        </div>
      </section>
    </main>
  </>;
}
