import type { Locale } from "@/lib/content";

const copy: Record<Locale, { title: string; description: string; openMap: string; credit: string }> = {
  fi: {
    title: "Tutki Salon seutua kartalla",
    description: "Suunnittele retkiä Salon keskustasta kyliin, Teijon luontoon ja Mathildedalin rannalle. Kartta avautuu myös suurempana OpenStreetMapissa.",
    openMap: "Avaa kartta suurempana",
    credit: "Kartta: OpenStreetMapin tekijät"
  },
  es: {
    title: "Explora la región de Salo en el mapa",
    description: "Planifica visitas desde el centro de Salo hasta los pueblos, la naturaleza de Teijo y la costa de Mathildedal. También puedes abrir el mapa en OpenStreetMap.",
    openMap: "Abrir mapa ampliado",
    credit: "Mapa: colaboradores de OpenStreetMap"
  },
  en: {
    title: "Explore the Salo region on the map",
    description: "Plan visits from central Salo to local villages, the nature of Teijo and the waterfront at Mathildedal. You can also open the map in OpenStreetMap.",
    openMap: "Open larger map",
    credit: "Map: OpenStreetMap contributors"
  }
};

export default function SaloMap({ locale = "es" }: { locale?: Locale }) {
  const t = copy[locale];
  const mapUrl = "https://www.openstreetmap.org/?mlat=60.383&mlon=23.133#map=10/60.383/23.133";
  const embedUrl = "https://www.openstreetmap.org/export/embed.html?bbox=22.65%2C60.08%2C23.78%2C60.63&layer=mapnik&marker=60.383%2C23.133";

  return (
    <section className="mt-14 overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center p-7 md:p-9">
          <div className="eyebrow text-copper">SALO · FINLAND</div>
          <h2 className="mt-3 font-display text-3xl">{t.title}</h2>
          <p className="mt-4 leading-7 text-black/65">{t.description}</p>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit rounded-full bg-pine px-5 py-3 font-extrabold text-white transition hover:opacity-90">
            {t.openMap} ↗
          </a>
          <p className="mt-4 text-xs text-black/45">{t.credit}</p>
        </div>
        <div className="min-h-[320px] bg-[#e9efe9] lg:min-h-[390px]">
          <iframe
            title={t.title}
            src={embedUrl}
            loading="lazy"
            className="h-full min-h-[320px] w-full border-0 lg:min-h-[390px]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
