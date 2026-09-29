import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("pages").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (!data) notFound();

  return <><Header/><main className="pt-32"><article className="container-site py-16">
    <div className="eyebrow text-copper">Finnexprience</div>
    <h1 className="mt-3 max-w-4xl font-display text-5xl md:text-7xl">{data.title_es}</h1>
    {data.hero_image && <img src={data.hero_image} alt="" className="mt-10 h-[420px] w-full rounded-[2rem] object-cover"/>}
    <div className="prose prose-lg mt-10 max-w-3xl whitespace-pre-wrap leading-8 text-black/70">{data.content_es}</div>
  </article></main></>;
}
