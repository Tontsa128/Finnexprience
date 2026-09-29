import Link from "next/link";
import Header from "@/components/Header";
import type { Locale } from "@/lib/content";

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  text: string;
  categories: string[];
  detail: string;
  planHref: string;
}> = {
  es: {
    eyebrow: "Experiencias",
    title: "Vive Finlandia a tu manera.",
    text: "Descubre alojamientos, saunas, naturaleza, archipiélago, gastronomía y actividades de proveedores locales. Empezamos en el suroeste de Finlandia.",
    categories: ["Cabañas y alojamientos", "Sauna y bienestar", "Naturaleza y archipiélago", "Gastronomía local", "Escapadas románticas", "Experiencias familiares"],
    detail: "Explorar y planificar",
    planHref: "/planifica",
  },
  en: {
    eyebrow: "Experiences",
    title: "Experience Finland your way.",
    text: "Discover cottages, saunas, nature, archipelago, local food and activities from local providers. We start in Southwest Finland.",
    categories: ["Cottages & stays", "Sauna & wellbeing", "Nature & archipelago", "Local food", "Romantic escapes", "Family experiences"],
    detail: "Explore & plan",
    planHref: "/en/planifica",
  },
  fi: {
    eyebrow: "Elämykset",
    title: "Koe Suomi omalla tavallasi.",
    text: "Löydä mökkejä, saunoja, luontoa, saaristoa, paikallista ruokaa ja paikallisten palveluntarjoajien elämyksiä. Aloitamme Lounais-Suomesta.",
    categories: ["Mökit ja majoitus", "Sauna ja hyvinvointi", "Luonto ja saaristo", "Paikallinen ruoka", "Romanttiset irtiotot", "Perhe-elämykset"],
    detail: "Tutustu ja suunnittele",
    planHref: "/fi/planifica",
  },
};

export default function ExperienciasPage({ locale = "es" }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="container-site py-16">
          <div className="eyebrow text-copper">{t.eyebrow}</div>
          <h1 className="mt-3 max-w-4xl font-display text-5xl md:text-7xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{t.text}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.categories.map((category, i) => (
              <Link href={t.planHref} key={category} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-sm font-bold text-copper">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-5 text-xl font-extrabold">{category}</h2>
                <p className="mt-3 text-sm text-black/55">{t.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
