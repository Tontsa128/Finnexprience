"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const languages=[{code:"ES",label:"Español",path:""},{code:"EN",label:"English",path:"en"},{code:"FI",label:"Suomi",path:"fi"}];
function withLocale(path:string,locale:string){if(locale==="es")return path;return `/${locale}${path==="/"?"":path}`;}
export default function Header(){
 const [open,setOpen]=useState(false); const pathname=usePathname();
 const locale=pathname.startsWith("/en")?"en":pathname.startsWith("/fi")?"fi":"es";
 const labels={es:{experiences:"Experiencias",destinations:"Destinos",plan:"Planifica tu viaje",admin:"Administración"},en:{experiences:"Experiences",destinations:"Destinations",plan:"Plan your trip",admin:"Admin"},fi:{experiences:"Elämykset",destinations:"Kohteet",plan:"Suunnittele matkasi",admin:"Hallinta"}}[locale];
 const basePath=pathname.replace(/^\/(en|fi)/,"")||"/";
 return <header className="absolute inset-x-0 top-0 z-30 text-white"><div className="container-site flex h-24 items-center justify-between">
 <Link href={withLocale("/",locale)} className="text-2xl font-extrabold tracking-tight">Finn<span className="text-[#e8b28f]">exprience</span></Link>
 <nav className="hidden items-center gap-8 md:flex"><Link href={withLocale("/experiencias",locale)}>{labels.experiences}</Link><Link href={withLocale("/destinos",locale)}>{labels.destinations}</Link><Link href={withLocale("/planifica",locale)}>{labels.plan}</Link><Link href="/admin" className="rounded-full border border-white/40 px-4 py-2 text-sm font-bold">{labels.admin}</Link></nav>
 <div className="flex items-center gap-3"><details className="group relative"><summary className="cursor-pointer list-none rounded-full border border-white/35 px-3 py-2 text-xs font-extrabold">{locale.toUpperCase()}⌄</summary><div className="absolute right-0 mt-2 grid min-w-32 gap-1 rounded-2xl bg-white p-2 text-ink shadow-xl">{languages.map(l=><Link key={l.code} href={withLocale(basePath,l.path)} className="rounded-xl px-3 py-2 text-sm font-bold hover:bg-black/5">{l.label}</Link>)}</div></details><button onClick={()=>setOpen(!open)} className="rounded-full border border-white/30 p-2 md:hidden" aria-label="Menú">{open?<X size={20}/>:<Menu size={20}/>}</button></div></div>
 {open&&<div className="glass border-t border-white/20 px-5 py-5 text-ink md:hidden"><div className="container-site grid gap-4 font-semibold"><Link href={withLocale("/experiencias",locale)} onClick={()=>setOpen(false)}>{labels.experiences}</Link><Link href={withLocale("/destinos",locale)} onClick={()=>setOpen(false)}>{labels.destinations}</Link><Link href={withLocale("/planifica",locale)} onClick={()=>setOpen(false)}>{labels.plan}</Link><Link href="/admin">Admin</Link></div></div>}</header>;
}