import Header from "@/components/Header";
import type { Locale } from "@/lib/content";

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  text: string;
  formTitle: string;
  date: string;
  interest: string;
  options: string[];
  story: string;
  submit: string;
}> = {
  es: {
    eyebrow: "Planifica",
    title: "Cuéntanos qué tipo de Finlandia quieres vivir.",
    text: "Cuéntanos tus fechas, intereses y estilo de viaje. La siguiente fase conectará este formulario con el asistente de viaje y una base de datos de servicios verificados.",
    formTitle: "Tu viaje empieza aquí",
    date: "¿Cuándo quieres viajar?",
    interest: "¿Qué te interesa?",
    options: ["Naturaleza", "Sauna", "Cabaña", "Archipiélago", "Gastronomía"],
    story: "Cuéntanos cómo imaginas tu viaje...",
    submit: "Preparar mi solicitud",
  },
  en: {
    eyebrow: "Plan your trip",
    title: "Tell us what kind of Finland you want to experience.",
    text: "Share your dates, interests and travel style. The next phase will connect this form to the travel assistant and a verified database of services.",
    formTitle: "Your journey starts here",
    date: "When would you like to travel?",
    interest: "What are you interested in?",
    options: ["Nature", "Sauna", "Cottage", "Archipelago", "Food"],
    story: "Tell us how you imagine your trip...",
    submit: "Prepare my request",
  },
  fi: {
    eyebrow: "Suunnittele matkasi",
    title: "Kerro meille, millaisen Suomen haluat kokea.",
    text: "Kerro matkasi ajankohta, kiinnostuksen kohteet ja matkustustyyli. Seuraavassa vaiheessa lomake yhdistetään matka-avustajaan ja varmennettujen palveluiden tietokantaan.",
    formTitle: "Matkasi alkaa tästä",
    date: "Milloin haluat matkustaa?",
    interest: "Mikä kiinnostaa sinua?",
    options: ["Luonto", "Sauna", "Mökki", "Saaristo", "Ruoka"],
    story: "Kerro, millaisesta matkasta haaveilet...",
    submit: "Valmistele pyyntöni",
  },
};

export default function PlanificaPage({ locale = "es" }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="container-site py-16">
          <div className="max-w-3xl">
            <div className="eyebrow text-copper">{t.eyebrow}</div>
            <h1 className="mt-3 font-display text-5xl md:text-7xl">{t.title}</h1>
            <p className="mt-6 text-lg leading-8 text-black/60">{t.text}</p>
          </div>
          <div className="mt-12 rounded-3xl bg-white p-8 shadow-soft ring-1 ring-black/5">
            <h2 className="text-2xl font-extrabold">{t.formTitle}</h2>
            <form className="mt-7 grid gap-4 md:grid-cols-2" action="/api/trip-request" method="post">
              <input name="date" required className="rounded-2xl border border-black/10 p-4" placeholder={t.date} />
              <select name="interest" required className="rounded-2xl border border-black/10 p-4">
                <option value="">{t.interest}</option>
                {t.options.map((option) => <option key={option}>{option}</option>)}
              </select>
              <textarea name="message" required className="min-h-36 rounded-2xl border border-black/10 p-4 md:col-span-2" placeholder={t.story} />
              <button type="submit" className="rounded-full bg-pine px-6 py-4 font-extrabold text-white md:w-fit">{t.submit}</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
