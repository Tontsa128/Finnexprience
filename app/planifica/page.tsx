import Header from "@/components/Header";
import type { Locale } from "@/lib/content";

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  text: string;
  formTitle: string;
  name: string;
  email: string;
  date: string;
  interest: string;
  options: string[];
  story: string;
  submit: string;
  success: string;
  error: string;
}> = {
  es: {
    eyebrow: "Planifica",
    title: "Cuéntanos qué tipo de Finlandia quieres vivir.",
    text: "Cuéntanos tus fechas, intereses y estilo de viaje. Te ayudaremos a encontrar opciones de proveedores locales.",
    formTitle: "Tu viaje empieza aquí",
    name: "Tu nombre",
    email: "Tu correo electrónico",
    date: "¿Cuándo quieres viajar?",
    interest: "¿Qué te interesa?",
    options: ["Naturaleza", "Sauna", "Cabaña", "Archipiélago", "Gastronomía"],
    story: "Cuéntanos cómo imaginas tu viaje...",
    submit: "Preparar mi solicitud",
    success: "Gracias. Hemos recibido tu solicitud y nos pondremos en contacto contigo.",
    error: "No hemos podido enviar la solicitud. Comprueba los datos e inténtalo de nuevo.",
  },
  en: {
    eyebrow: "Plan your trip",
    title: "Tell us what kind of Finland you want to experience.",
    text: "Share your dates, interests and travel style. We will help you discover suitable local providers.",
    formTitle: "Your journey starts here",
    name: "Your name",
    email: "Your email address",
    date: "When would you like to travel?",
    interest: "What are you interested in?",
    options: ["Nature", "Sauna", "Cottage", "Archipelago", "Food"],
    story: "Tell us how you imagine your trip...",
    submit: "Prepare my request",
    success: "Thank you. We received your request and will get in touch with you.",
    error: "We could not send your request. Please check the details and try again.",
  },
  fi: {
    eyebrow: "Suunnittele matkasi",
    title: "Kerro meille, millaisen Suomen haluat kokea.",
    text: "Kerro matkasi ajankohta, kiinnostuksen kohteet ja matkustustyyli. Autamme löytämään sopivia paikallisia palveluntarjoajia.",
    formTitle: "Matkasi alkaa tästä",
    name: "Nimesi",
    email: "Sähköpostiosoitteesi",
    date: "Milloin haluat matkustaa?",
    interest: "Mikä kiinnostaa sinua?",
    options: ["Luonto", "Sauna", "Mökki", "Saaristo", "Ruoka"],
    story: "Kerro, millaisesta matkasta haaveilet...",
    submit: "Lähetä pyyntö",
    success: "Kiitos. Pyyntösi on vastaanotettu ja olemme sinuun yhteydessä.",
    error: "Pyyntöä ei voitu lähettää. Tarkista tiedot ja yritä uudelleen.",
  },
};

type SearchParams = Promise<{ sent?: string; error?: string }>;

export default async function PlanificaPage({
  locale = "es",
  searchParams,
}: {
  locale?: Locale;
  searchParams?: SearchParams;
}) {
  const t = copy[locale];
  const params = searchParams ? await searchParams : {};
  const sent = params.sent === "1";
  const failed = params.error === "invalid" || params.error === "service";

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
            {sent && <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{t.success}</p>}
            {failed && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{t.error}</p>}
            {!sent && (
              <form className="mt-7 grid gap-4 md:grid-cols-2" action="/api/trip-request" method="post">
                <input type="hidden" name="locale" value={locale} />
                <input name="name" className="rounded-2xl border border-black/10 p-4" placeholder={t.name} autoComplete="name" />
                <input name="email" type="email" required className="rounded-2xl border border-black/10 p-4" placeholder={t.email} autoComplete="email" />
                <input name="date" required className="rounded-2xl border border-black/10 p-4" placeholder={t.date} />
                <select name="interest" required className="rounded-2xl border border-black/10 p-4">
                  <option value="">{t.interest}</option>
                  {t.options.map((option) => <option key={option}>{option}</option>)}
                </select>
                <textarea name="message" required minLength={10} className="min-h-36 rounded-2xl border border-black/10 p-4 md:col-span-2" placeholder={t.story} />
                <button type="submit" className="rounded-full bg-pine px-6 py-4 font-extrabold text-white transition hover:-translate-y-0.5 md:w-fit">{t.submit}</button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
