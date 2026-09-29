"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  const [index, setIndex] = useState(0);
  const slide = content.slides[index] ?? content.slides[0];
  useEffect(() => {
    if (content.slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % content.slides.length), 6000);
    return () => clearInterval(timer);
  }, [content.slides.length]);
  return <section className="relative min-h-[760px] overflow-hidden bg-pine text-white">
    <div className="absolute inset-0">
      <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,25,21,.78)_0%,rgba(7,25,21,.42)_48%,rgba(7,25,21,.18)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071915]/70 via-transparent to-transparent" />
    </div>
    <div className="container-site relative z-10 flex min-h-[760px] items-end pb-24 pt-40">
      <div className="max-w-3xl">
        <div className="eyebrow mb-5 text-[#e8b28f]">{slide.eyebrow}</div>
        <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl md:text-8xl">{content.heroTitle.es}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">{content.heroText.es}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/planifica" className="inline-flex items-center gap-2 rounded-full bg-[#e8b28f] px-6 py-4 font-extrabold text-ink">{content.ctaPrimary.es} <ArrowRight size={18}/></Link>
          <Link href="/experiencias" className="rounded-full border border-white/45 bg-white/10 px-6 py-4 font-extrabold backdrop-blur hover:bg-white hover:text-ink">{content.ctaSecondary.es}</Link>
        </div>
      </div>
    </div>
    <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2 md:right-10">
      <button onClick={() => setIndex((index - 1 + content.slides.length) % content.slides.length)} className="rounded-full border border-white/30 bg-black/15 p-3 backdrop-blur" aria-label="Anterior"><ChevronLeft/></button>
      <div className="flex gap-2">{content.slides.map((s,i)=><button key={s.id} onClick={()=>setIndex(i)} aria-label={`Imagen ${i+1}`} className={`h-2 rounded-full transition-all ${i===index ? "w-10 bg-white":"w-2 bg-white/50"}`}/>)}</div>
      <button onClick={() => setIndex((index + 1) % content.slides.length)} className="rounded-full border border-white/30 bg-black/15 p-3 backdrop-blur" aria-label="Siguiente"><ChevronRight/></button>
    </div>
  </section>;
}