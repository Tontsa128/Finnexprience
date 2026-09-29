import Link from "next/link";
import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DestinosPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from("destinations").select("*").eq("published", true).order("sort_order") : { data: null };
  const destinations = data ?? [
    { slug:"salo", name_es:"Salo", description_es:"Costa, naturaleza y auténtica vida local del suroeste de Finlandia.", image_url:"/images/hero-archipelago.svg" },
    { slug:"mathildedal", name_es:"Mathildedal", description_es:"Un pequeño pueblo lleno de historia, naturaleza y encanto.", image_url:"/images/hero-summer.svg" },
    { slug:"teijo", name_es:"Teijo", description_es:"Bosques, lagos y senderos para respirar la Finlandia tranquila.", image_url:"/images/hero-sauna.svg" }
  ];
  return <><Header/><main className="pt-32"><section className="container-site py-16"><div className="eyebrow text-copper">Destinos</div><h1 className="mt-3 max-w-4xl font-display text-5xl md:text-7xl">Lugares que merecen ser vividos.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">Empezamos en Salo, Mathildedal y Teijo. La plataforma está preparada para crecer por todo el suroeste de Finlandia y, después, por todo el país.</p><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{destinations.map(d=><Link href={`${typeof window==="undefined" ? "" : ""}/${d.slug}`} key={d.slug} className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5"><img src={d.image_url} alt={d.name_es} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"/><div className="p-6"><h2 className="font-display text-3xl">{d.name_es}</h2><p className="mt-3 text-black/60">{d.description_es}</p><span className="mt-6 inline-block font-bold text-pine">Descubrir →</span></div></Link>)}</div></section></main></>;
}