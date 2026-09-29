"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="absolute inset-x-0 top-0 z-30 text-white">
    <div className="container-site flex h-24 items-center justify-between">
      <Link href="/" className="text-2xl font-extrabold tracking-tight">Finn<span className="text-[#e8b28f]">exprience</span></Link>
      <nav className="hidden items-center gap-8 md:flex">
        <Link href="/experiencias" className="text-sm font-semibold hover:text-[#e8b28f]">Experiencias</Link>
        <Link href="/destinos" className="text-sm font-semibold hover:text-[#e8b28f]">Destinos</Link>
        <Link href="/planifica" className="text-sm font-semibold hover:text-[#e8b28f]">Planifica tu viaje</Link>
        <Link href="/admin" className="rounded-full border border-white/40 px-4 py-2 text-sm font-bold hover:bg-white hover:text-ink">Admin</Link>
      </nav>
      <div className="flex items-center gap-3">
        <button aria-label="Cambiar idioma" className="rounded-full border border-white/35 px-3 py-2 text-xs font-extrabold">ES⌄</button>
        <button onClick={() => setOpen(!open)} className="rounded-full border border-white/30 p-2 md:hidden" aria-label="Menú">{open ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
    </div>
    {open && <div className="glass border-t border-white/20 px-5 py-5 text-ink md:hidden">
      <div className="container-site grid gap-4 font-semibold">
        <Link href="/experiencias">Experiencias</Link><Link href="/destinos">Destinos</Link><Link href="/planifica">Planifica tu viaje</Link><Link href="/admin">Administración</Link>
      </div>
    </div>}
  </header>;
}