"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale, SiteContent } from "@/lib/content";

const labels: Record<Locale, { previous: string; next: string; image: string }> = {
  es: { previous: "Anterior", next: "Siguiente", image: "Imagen" },
  en: { previous: "Previous", next: "Next", image: "Image" },
  fi: { previous: "Edellinen", next: "Seuraava", image: "Kuva" },
};

function localizedPath(path: string, locale: Locale) {
  return locale === "es" ? path : "/" + locale + path;
}

export default function Hero({ content, locale = "es" }: { content: SiteContent; locale?: Locale }) {
  const [index, setIndex] = useState(0);
  const slide = content.slides[index] ?? content.slides[0];
  const text = labels[locale];

  useEffect(() => {
    if (content.slides.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % content.slides.length), 6000);
    return () => clearInterval(timer);
  }, [content.slides.length]);

  return <section className="relative min-h-[690px] overflow-hidden bg-pine text-white md:min-h-[790px]">
    <div className="absolute inset-0">
      <Image src={slide.image} alt={slide.alt} fill priority sizes="100vw" className="object-cover transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,25,21,.78)_0%,rgba(7,25,21,.42)_48%,rgba(7,25,21,.18)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071915]/70 via-transparent to-transparent" />
    </div>
    <div className="container-site relative z-10 flex min-h-[690px] items-end pb-28 pt-36 md:min-h-[790px] md:pb-32">
      <div className="max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-3"><span className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-white backdrop-blur">{locale === "fi" ? "Salo · Varsinais-Suomi" : locale === "en" ? "Salo · Southwest Finland" : "Salo · Finlandia suroccidental"}</span><span className="eyebrow text-[#f0c4a6]">{slide.eyebrow}</span></div>
        <p className="mb-4 max-w-xl text-sm font-bold tracking-wide text-white/85 md:text-base">{content.tagline[locale]}</p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] sm:text-6xl md:text-8xl">{content.heroTitle[locale]}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">{content.heroText[locale]}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href={localizedPath("/planifica", locale)} className="inline-flex items-center gap-2 rounded-full bg-[#e8b28f] px-6 py-4 font-extrabold text-ink shadow-[0_12px_30px_rgba(0,0,0,.18)] transition hover:-translate-y-0.5 hover:bg-white">{content.ctaPrimary[locale]} <ArrowRight size={18}/></Link>
          <Link href={localizedPath("/experiencias", locale)} className="rounded-full border border-white/55 bg-white/10 px-6 py-4 font-extrabold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-ink">{content.ctaSecondary[locale]}</Link>
        </div>
      </div>
    </div>
    <div className="container-site pointer-events-none absolute bottom-8 left-0 right-0 z-10 hidden md:block">
      <div className="flex max-w-max items-center gap-3 rounded-2xl border border-white/20 bg-[#071915]/35 px-4 py-3 text-sm text-white/90 backdrop-blur-md">
        <span className="text-lg">✦</span>
        <span>{locale === "fi" ? "Aitoja paikallisia kohteita · suorat linkit palveluntarjoajille" : locale === "en" ? "Authentic local places · direct links to providers" : "Lugares auténticos · enlaces directos a proveedores"}</span>
      </div>
    </div>
    {(slide.credit || slide.sourceUrl) && <div className="absolute bottom-2 left-4 z-20 max-w-[65%] text-[10px] leading-4 text-white/75 md:left-10">{slide.credit && <span>{slide.credit}</span>}{slide.credit && slide.sourceUrl && " · "}{slide.sourceUrl && <a href={slide.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{locale === "fi" ? "Kuvan lähde" : locale === "en" ? "Image source" : "Fuente de imagen"} ↗</a>}</div>}
    <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2 md:right-10">
      <button onClick={() => setIndex((current) => (current - 1 + content.slides.length) % content.slides.length)} className="rounded-full border border-white/30 bg-black/15 p-3 backdrop-blur" aria-label={text.previous}><ChevronLeft/></button>
      <div className="flex gap-2">{content.slides.map((currentSlide,i)=><button key={currentSlide.id} onClick={()=>setIndex(i)} aria-label={text.image + " " + (i+1)} className={"h-2 rounded-full transition-all " + (i===index ? "w-10 bg-white":"w-2 bg-white/50")}/>)}</div>
      <button onClick={() => setIndex((current) => (current + 1) % content.slides.length)} className="rounded-full border border-white/30 bg-black/15 p-3 backdrop-blur" aria-label={text.next}><ChevronRight/></button>
    </div>
  </section>;
}
