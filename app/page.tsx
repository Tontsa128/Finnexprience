import Link from "next/link";
import { ArrowRight, Compass, Heart, Map, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { categories, type Locale } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content";

const copy = {
  es: {
    localTitle: "Local & auténtico", localText: "Lugares y personas que conocen Finlandia de verdad.",
    experiencesTitle: "Experiencias locales", experiencesText: "Sauna, naturaleza, comida, mar y vida de cabaña.",
    languageTitle: "En español", languageText: "Información clara y ayuda para viajar con confianza.",
    rhythmTitle: "Tu viaje, tu ritmo", rhythmText: "Ideas para escapadas tranquilas de verano y más.",
    exploreEyebrow: "Empieza a explorar", exploreTitle: "Finlandia se siente diferente cuando la vives como un local.",
    exploreText: "Desde la costa de Salo y Mathildedal hasta los bosques, lagos y pequeñas islas. Te ayudamos a encontrar el lugar que encaja contigo.",
    explore: "Explorar", selected: "Descubre opciones seleccionadas para tu viaje.",
    assistantEyebrow: "Tu asistente de viaje", assistantTitle: "¿No sabes por dónde empezar?",
    assistantText: "Cuéntanos qué buscas. El asistente de Finnexprience te ayudará a descubrir experiencias, comparar opciones y construir ideas para tu viaje.",
    plan: "Planificar mi viaje", inspiration: "Inspiración", inspirationText: "Encuentra ideas según tu estilo.",
    discovery: "Descubrimiento", discoveryText: "Explora destinos y servicios locales.",
    clarity: "Información clara", clarityText: "Datos que pueden verificarse antes de reservar.",
    moments: "Momentos especiales", momentsText: "Viajes alrededor de lo que te importa.",
    regionEyebrow: "Primera región", regionTitle: "Descubre la región de Salo.",
    regionText: "Empieza por Salo: alojamientos, pueblos, gastronomía, naturaleza y experiencias locales en la costa suroeste de Finlandia.",
    destinations: "Descubrir Salo", footer: "Authentic Finland · Español · English · Suomi",
  },
  en: {
    localTitle: "Local & authentic", localText: "Places and people who know the real Finland.",
    experiencesTitle: "Local experiences", experiencesText: "Sauna, nature, food, sea and authentic cottage life.",
    languageTitle: "Spanish-friendly", languageText: "Clear information and support for confident travel.",
    rhythmTitle: "Your trip, your pace", rhythmText: "Ideas for peaceful summer escapes and beyond.",
    exploreEyebrow: "Start exploring", exploreTitle: "Finland feels different when you experience it like a local.",
    exploreText: "From the coast of Salo and Mathildedal to forests, lakes and small islands. We help you find places that fit your way of travelling.",
    explore: "Explore", selected: "Discover selected options for your trip.",
    assistantEyebrow: "Your travel assistant", assistantTitle: "Not sure where to start?",
    assistantText: "Tell us what you are looking for. The Finnexprience assistant will help you discover experiences, compare options and shape ideas for your trip.",
    plan: "Plan my trip", inspiration: "Inspiration", inspirationText: "Find ideas based on your style.",
    discovery: "Discovery", discoveryText: "Explore destinations and local services.",
    clarity: "Clear information", clarityText: "Information that can be verified before booking.",
    moments: "Special moments", momentsText: "Trips shaped around what matters to you.",
    regionEyebrow: "Our first region", regionTitle: "Discover the Salo region.",
    regionText: "Start with Salo: accommodation, villages, local food, nature and experiences along Finland’s southwest coast.",
    destinations: "Explore Salo", footer: "Authentic Finland · Español · English · Suomi",
  },
  fi: {
    localTitle: "Paikallinen ja aito", localText: "Paikat ja ihmiset, jotka tuntevat aidon Suomen.",
    experiencesTitle: "Paikalliset elämykset", experiencesText: "Sauna, luonto, ruoka, meri ja aito mökkielämä.",
    languageTitle: "Palvelua espanjaksi", languageText: "Selkeää tietoa ja apua luottavaan matkustamiseen.",
    rhythmTitle: "Sinun matkasi, sinun rytmisi", rhythmText: "Ideoita rauhalliseen kesälomaan ja muihin elämyksiin.",
    exploreEyebrow: "Aloita tutkiminen", exploreTitle: "Suomi tuntuu erilaiselta, kun koet sen paikallisen tavoin.",
    exploreText: "Salon ja Mathildedalin rannikolta metsiin, järville ja pienille saarille. Autamme löytämään paikat, jotka sopivat juuri sinun tapaasi matkustaa.",
    explore: "Tutustu", selected: "Löydä matkallesi valittuja vaihtoehtoja.",
    assistantEyebrow: "Matka-avustajasi", assistantTitle: "Etkö tiedä, mistä aloittaa?",
    assistantText: "Kerro, mitä etsit. Finnexpriencen avustaja auttaa löytämään elämyksiä, vertailemaan vaihtoehtoja ja rakentamaan matkaideoita.",
    plan: "Suunnittele matkani", inspiration: "Inspiraatio", inspirationText: "Löydä ideoita oman matkustustyylisi mukaan.",
    discovery: "Löytäminen", discoveryText: "Tutustu kohteisiin ja paikallisiin palveluihin.",
    clarity: "Selkeä tieto", clarityText: "Tietoa, jonka voi tarkistaa ennen varaamista.",
    moments: "Erityiset hetket", momentsText: "Matkoja, jotka rakentuvat sinulle tärkeiden asioiden ympärille.",
    regionEyebrow: "Ensimmäinen alue", regionTitle: "Tutustu Salon seutuun.",
    regionText: "Aloita Salosta: majoitusta, kyliä, paikallista ruokaa, luontoa ja elämyksiä Suomen lounaisrannikolla.",
    destinations: "Tutustu Salon seutuun", footer: "Aito Suomi · Español · English · Suomi",
  },
} as const;

export default async function Home({ locale = "es" }: { locale?: Locale }) {
  const siteContent = await getSiteContent(locale);
  const t = copy[locale];
  const prefix = locale === "es" ? "" : "/" + locale;

  return <>
    <Header />
    <main>
      <Hero content={siteContent} locale={locale} />

      <section className="relative -mt-10 z-20">
        <div className="container-site">
          <div className="glass grid rounded-3xl p-5 shadow-soft md:grid-cols-4 md:p-7">
            {[
              ["⌖", t.localTitle, t.localText],
              ["♨", t.experiencesTitle, t.experiencesText],
              ["ES", t.languageTitle, t.languageText],
              ["✦", t.rhythmTitle, t.rhythmText],
            ].map(([icon, title, description], index) => (
              <div key={title} className={"p-4 " + (index < 3 ? "border-b border-black/10 md:border-b-0 md:border-r" : "")}>
                <div className="text-2xl">{icon}</div>
                <div className="mt-2 font-bold">{title}</div>
                <p className="mt-1 text-sm text-black/60">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-24">
        <div className="max-w-2xl">
          <div className="eyebrow text-copper">{t.exploreEyebrow}</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">{t.exploreTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-black/60">{t.exploreText}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.key} href={prefix + "/experiencias?tipo=" + category.key} className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-soft">
              <span className="text-4xl">{category.icon}</span>
              <h3 className="mt-8 text-xl font-extrabold">{category[locale]}</h3>
              <p className="mt-2 text-sm text-black/55">{t.selected}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pine">{t.explore} <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-white">
        <div className="container-site grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="eyebrow text-[#e8b28f]">{t.assistantEyebrow}</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{t.assistantTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/65">{t.assistantText}</p>
            <Link href={prefix + "/planifica"} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-extrabold text-ink">{t.plan} <Sparkles size={18}/></Link>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                { Icon: Compass, title: t.inspiration, description: t.inspirationText },
                { Icon: Map, title: t.discovery, description: t.discoveryText },
                { Icon: ShieldCheck, title: t.clarity, description: t.clarityText },
                { Icon: Heart, title: t.moments, description: t.momentsText },
              ] satisfies Array<{ Icon: LucideIcon; title: string; description: string }>).map(({ Icon, title, description }) => (
                <div key={title}>
                  <Icon className="text-[#e8b28f]" />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-white/55">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-24">
        <Link href={prefix + "/salo"} className="group grid overflow-hidden rounded-[2rem] bg-[#e9efe9] shadow-sm ring-1 ring-black/5 transition hover:shadow-xl md:grid-cols-2">
          <div className="relative min-h-[300px] overflow-hidden md:min-h-[440px]">
            <img src="/images/hero-archipelago.svg" alt={locale === "fi" ? "Salon seudun rannikko ja saaristomaisema" : locale === "en" ? "Coastline and archipelago near Salo" : "Costa y archipiélago cerca de Salo"} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-ink">Salo · Varsinais-Suomi</span>
          </div>
          <div className="flex flex-col items-start justify-center p-8 md:p-12 lg:p-16">
            <div className="eyebrow text-moss">{t.regionEyebrow}</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">{t.regionTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-black/60">{t.regionText}</p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-4 font-extrabold text-white">{t.destinations} <ArrowRight size={18} className="transition group-hover:translate-x-1"/></span>
          </div>
        </Link>
      </section>
    </main>
    <footer className="border-t border-black/10 py-10">
      <div className="container-site flex flex-col justify-between gap-4 text-sm text-black/50 md:flex-row">
        <span>© 2026 Finnexprience</span><span>{t.footer}</span>
      </div>
    </footer>
  </>;
}
