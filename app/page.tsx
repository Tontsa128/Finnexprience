import Link from "next/link";
import { ArrowRight, Compass, Heart, Map, ShieldCheck, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { categories } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {\n  const siteContent = await getSiteContent();
  return <>
    <Header />
    <main>
      <Hero content={siteContent} />
      <section className="relative -mt-10 z-20">
        <div className="container-site">
          <div className="glass grid rounded-3xl p-5 shadow-soft md:grid-cols-4 md:p-7">
            <div className="border-b border-black/10 p-4 md:border-b-0 md:border-r"><div className="text-2xl">⌖</div><div className="mt-2 font-bold">Local & auténtico</div><p className="mt-1 text-sm text-black/60">Lugares y personas que conocen Finlandia de verdad.</p></div>
            <div className="border-b border-black/10 p-4 md:border-b-0 md:border-r"><div className="text-2xl">♨</div><div className="mt-2 font-bold">Experiencias locales</div><p className="mt-1 text-sm text-black/60">Sauna, naturaleza, comida, mar y vida de cabaña.</p></div>
            <div className="border-b border-black/10 p-4 md:border-b-0 md:border-r"><div className="text-2xl">ES</div><div className="mt-2 font-bold">En español</div><p className="mt-1 text-sm text-black/60">Información clara y ayuda para viajar con confianza.</p></div>
            <div className="p-4"><div className="text-2xl">✦</div><div className="mt-2 font-bold">Tu viaje, tu ritmo</div><p className="mt-1 text-sm text-black/60">Ideas para escapadas tranquilas de verano y más.</p></div>
          </div>
        </div>
      </section>

      <section className="container-site py-24">
        <div className="max-w-2xl"><div className="eyebrow text-copper">Empieza a explorar</div><h2 className="mt-3 font-display text-4xl md:text-6xl">Finlandia se siente diferente cuando la vives como un local.</h2><p className="mt-5 text-lg leading-8 text-black/60">Desde la costa de Salo y Mathildedal hasta los bosques, lagos y pequeñas islas. Te ayudamos a encontrar el lugar que encaja contigo.</p></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c=><Link key={c.key} href={`/experiencias?tipo=${c.key}`} className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-soft"><span className="text-4xl">{c.icon}</span><h3 className="mt-8 text-xl font-extrabold">{c.es}</h3><p className="mt-2 text-sm text-black/55">Descubre opciones seleccionadas para tu viaje.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pine">Explorar <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></Link>)}</div>
      </section>

      <section className="bg-ink py-24 text-white">
        <div className="container-site grid gap-12 md:grid-cols-2 md:items-center">
          <div><div className="eyebrow text-[#e8b28f]">Tu asistente de viaje</div><h2 className="mt-3 font-display text-4xl md:text-6xl">¿No sabes por dónde empezar?</h2><p className="mt-5 max-w-xl text-lg leading-8 text-white/65">Cuéntanos qué buscas. El futuro asistente de Finnexprience podrá ayudarte a descubrir experiencias, comparar opciones y construir ideas para tu viaje.</p><Link href="/planifica" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-extrabold text-ink">Planificar mi viaje <Sparkles size={18}/></Link></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8"><div className="grid gap-5 sm:grid-cols-2"><div><Compass className="text-[#e8b28f]"/><h3 className="mt-4 font-bold">Inspiración</h3><p className="mt-2 text-sm text-white/55">Encuentra ideas según tu estilo.</p></div><div><Map className="text-[#e8b28f]"/><h3 className="mt-4 font-bold">Descubrimiento</h3><p className="mt-2 text-sm text-white/55">Explora destinos y servicios locales.</p></div><div><ShieldCheck className="text-[#e8b28f]"/><h3 className="mt-4 font-bold">Información clara</h3><p className="mt-2 text-sm text-white/55">Datos que pueden verificarse antes de reservar.</p></div><div><Heart className="text-[#e8b28f]"/><h3 className="mt-4 font-bold">Momentos especiales</h3><p className="mt-2 text-sm text-white/55">Viajes diseñados alrededor de lo que te importa.</p></div></div></div>
        </div>
      </section>

      <section className="container-site py-24"><div className="rounded-[2rem] bg-[#e9efe9] p-8 md:p-14"><div className="max-w-3xl"><div className="eyebrow text-moss">Primera región</div><h2 className="mt-3 font-display text-4xl md:text-6xl">Salo, Mathildedal y la costa del suroeste.</h2><p className="mt-5 text-lg leading-8 text-black/60">Nuestro punto de partida: una Finlandia cercana, tranquila y llena de historias. Después, el concepto puede crecer hacia todo Varsinais-Suomi y el resto del país.</p><Link href="/destinos" className="mt-8 inline-flex items-center gap-2 font-extrabold text-pine">Ver destinos <ArrowRight size={18}/></Link></div></div></section>
    </main>
    <footer className="border-t border-black/10 py-10"><div className="container-site flex flex-col justify-between gap-4 text-sm text-black/50 md:flex-row"><span>© 2026 Finnexprience</span><span>Authentic Finland · Español · English · Suomi</span></div></footer>
  </>;
}