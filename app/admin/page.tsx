"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { FileText, ImagePlus, LayoutDashboard, LogIn, Plus, Save, Trash2, Upload, X } from "lucide-react";

type Slide={id:string;image_url:string;alt_es:string;eyebrow_es:string;sort_order:number;active:boolean};
type Page={id:string;slug:string;title_es:string;title_en:string;title_fi:string;content_es:string;content_en:string;content_fi:string;hero_image:string|null;published:boolean};

const emptyPage={slug:"",title_es:"",title_en:"",title_fi:"",content_es:"",content_en:"",content_fi:"",hero_image:"",published:false};

export default function AdminPage(){
 const supabase=createSupabaseBrowserClient();
 const [session,setSession]=useState<any>(null),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const [tab,setTab]=useState<"dashboard"|"hero"|"pages">("dashboard"),[slides,setSlides]=useState<Slide[]>([]),[pages,setPages]=useState<Page[]>([]),[homepage,setHomepage]=useState<any>({}),[page,setPage]=useState<any>(null),[saving,setSaving]=useState(false);

 async function load(){
  setLoading(true);
  const {data:{session:s}}=await supabase.auth.getSession();
  if(!s){setSession(null);setLoading(false);return;}
  const {data:admin}=await supabase.from("admin_users").select("email").eq("user_id",s.user.id).maybeSingle();
  if(!admin){await supabase.auth.signOut();setError("Tällä käyttäjällä ei ole pääkäyttäjän oikeuksia.");setLoading(false);return;}
  setSession(s);
  const [sl,pg,st]=await Promise.all([
   supabase.from("hero_slides").select("*").order("sort_order"),
   supabase.from("pages").select("*").order("created_at",{ascending:false}),
   supabase.from("site_settings").select("value").eq("key","homepage").maybeSingle()
  ]);
  setSlides((sl.data??[]) as Slide[]);setPages((pg.data??[]) as Page[]);setHomepage(st.data?.value??{});
  setLoading(false);
 }
 useEffect(()=>{load();},[]);

 async function login(){
  setError("");setLoading(true);
  const {error:e}=await supabase.auth.signInWithPassword({email,password});
  if(e)setError(e.message);
  await load();
 }
 async function logout(){await supabase.auth.signOut();setSession(null);}
 async function saveHome(){
  setSaving(true);
  const {error:e}=await supabase.from("site_settings").upsert({key:"homepage",value:homepage},{onConflict:"key"});
  if(e)setError(e.message);setSaving(false);
 }
 async function uploadSlide(file:File){
  setError("");setSaving(true);
  const ext=file.name.split(".").pop()||"jpg";const path=`hero/${crypto.randomUUID()}.${ext}`;
  const up=await supabase.storage.from("media").upload(path,file,{upsert:false,contentType:file.type});
  if(up.error){setError("Kuvan lataus epäonnistui. Luo Supabaseen public bucket 'media'.");setSaving(false);return;}
  const url=supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  await supabase.from("hero_slides").insert({image_url:url,alt_es:"Finnish travel",eyebrow_es:"Authentic Finland",sort_order:slides.length});
  await load();setSaving(false);
 }
 async function deleteSlide(id:string){await supabase.from("hero_slides").delete().eq("id",id);await load();}
 async function savePage(){
  if(!page?.slug)return;
  setSaving(true);
  const payload={...page,hero_image:page.hero_image||null,updated_at:new Date().toISOString()};
  const result=page.id?await supabase.from("pages").update(payload).eq("id",page.id):await supabase.from("pages").insert(payload);
  if(result.error)setError(result.error.message);else {setPage(null);await load();}
  setSaving(false);
 }
 async function deletePage(id:string){await supabase.from("pages").delete().eq("id",id);await load();}

 if(loading)return <main className="grid min-h-screen place-items-center bg-ink text-white"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"/><p className="mt-4 text-white/60">Ladataan hallintaa…</p></div></main>;
 if(!session)return <main className="min-h-screen bg-ink px-5 py-16 text-white"><div className="mx-auto max-w-md pt-20"><div className="text-2xl font-extrabold">Finn<span className="text-[#e8b28f]">exprience</span></div><h1 className="mt-10 font-display text-5xl">Pääkäyttäjä</h1><p className="mt-4 text-white/55">Kirjaudu Supabase Auth -tunnuksella. Vain admin_users-tauluun lisätyt käyttäjät pääsevät sisältöön.</p><div className="mt-8 space-y-4"><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-2xl bg-white/10 p-4 outline-none" placeholder="Sähköposti" /><input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full rounded-2xl bg-white/10 p-4 outline-none" placeholder="Salasana" /><button onClick={login} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e8b28f] p-4 font-extrabold text-ink"><LogIn size={18}/> Kirjaudu</button>{error&&<p className="rounded-2xl bg-red-500/15 p-4 text-sm text-red-200">{error}</p>}</div></div></main>;

 return <main className="min-h-screen bg-[#f5f6f2] text-ink">
  <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><div className="font-extrabold">Finn<span className="text-copper">exprience</span> <span className="font-normal text-black/35">/ Admin</span></div><button onClick={logout} className="rounded-full border px-4 py-2 text-sm font-bold">Kirjaudu ulos</button></div></header>
  <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[230px_1fr]">
   <aside className="h-fit rounded-3xl bg-ink p-3 text-white"><div className="grid gap-1 text-sm font-bold">
    {([["dashboard","Yleiskatsaus",LayoutDashboard],["hero","Etusivun kuvat",ImagePlus],["pages","Sivut",FileText]] as const).map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={`flex items-center gap-3 rounded-2xl p-3 text-left ${tab===id?"bg-white/10":"hover:bg-white/5"}`}><Icon size={17}/>{label}</button>)}
   </div></aside>
   <section>
    {error&&<div className="mb-5 flex items-center justify-between rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}<button onClick={()=>setError("")}><X size={16}/></button></div>}
    {tab==="dashboard"&&<><h1 className="text-4xl font-extrabold">Hallintapaneeli</h1><p className="mt-2 text-black/55">Muokkaa sivustoa ilman koodia.</p><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{slides.length}</div><p className="mt-2 text-sm text-black/55">Hero-kuvaa</p></div><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{pages.length}</div><p className="mt-2 text-sm text-black/55">Sivua</p></div><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{pages.filter(p=>p.published).length}</div><p className="mt-2 text-sm text-black/55">Julkaistua</p></div></div><div className="mt-8 rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-xl font-extrabold">Etusivun espanjankielinen teksti</h2><input value={homepage.heroTitle?.es??""} onChange={e=>setHomepage({...homepage,heroTitle:{...homepage.heroTitle,es:e.target.value}})} className="mt-4 w-full rounded-2xl border p-4" /><textarea value={homepage.heroText?.es??""} onChange={e=>setHomepage({...homepage,heroText:{...homepage.heroText,es:e.target.value}})} className="mt-3 min-h-32 w-full rounded-2xl border p-4" /><button disabled={saving} onClick={saveHome} className="mt-4 flex items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Save size={16}/> Tallenna</button></div></>}
    {tab==="hero"&&<><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Etusivun kuvat</h1><p className="mt-2 text-black/55">Kuvat vaihtuvat automaattisesti. Tekstit pysyvät paikoillaan.</p></div><label className="flex cursor-pointer items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Upload size={17}/> Lisää kuva<input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&uploadSlide(e.target.files[0])}/></label></div><div className="mt-8 grid gap-5 md:grid-cols-2">{slides.map(s=><div key={s.id} className="overflow-hidden rounded-3xl bg-white shadow-sm"><img src={s.image_url} alt={s.alt_es} className="h-64 w-full object-cover"/><div className="flex items-center justify-between p-5"><div><div className="font-bold">{s.eyebrow_es||"Hero-kuva"}</div><div className="text-sm text-black/45">Järjestys {s.sort_order+1}</div></div><button onClick={()=>deleteSlide(s.id)} className="rounded-full border p-3 text-red-600" aria-label="Poista"><Trash2 size={17}/></button></div></div>)}</div></>}
    {tab==="pages"&&<><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Sivut</h1><p className="mt-2 text-black/55">Luo uusia kohde-, opas- ja kampanjasivuja.</p></div><button onClick={()=>setPage({...emptyPage})} className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Plus size={17}/> Uusi sivu</button></div><div className="mt-8 grid gap-4">{pages.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm"><div><div className="font-extrabold">{p.title_es||p.slug}</div><div className="mt-1 text-sm text-black/45">/{p.slug} · {p.published?"Julkaistu":"Luonnos"}</div></div><div className="flex gap-2"><button onClick={()=>setPage(p)} className="rounded-full border px-4 py-2 text-sm font-bold">Muokkaa</button><button onClick={()=>deletePage(p.id)} className="rounded-full border px-4 py-2 text-sm font-bold text-red-600">Poista</button></div></div>)}</div>{page&&<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-5"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-2xl font-extrabold">{page.id?"Muokkaa sivua":"Uusi sivu"}</h2><button onClick={()=>setPage(null)}><X/></button></div><div className="mt-6 grid gap-4"><input value={page.slug} onChange={e=>setPage({...page,slug:e.target.value})} className="rounded-2xl border p-4" placeholder="URL slug esim. mathildedal"/><input value={page.title_es} onChange={e=>setPage({...page,title_es:e.target.value})} className="rounded-2xl border p-4" placeholder="Otsikko ES"/><input value={page.title_en} onChange={e=>setPage({...page,title_en:e.target.value})} className="rounded-2xl border p-4" placeholder="Title EN"/><input value={page.title_fi} onChange={e=>setPage({...page,title_fi:e.target.value})} className="rounded-2xl border p-4" placeholder="Otsikko FI"/><textarea value={page.content_es} onChange={e=>setPage({...page,content_es:e.target.value})} className="min-h-44 rounded-2xl border p-4" placeholder="Contenido ES"/><textarea value={page.content_en} onChange={e=>setPage({...page,content_en:e.target.value})} className="min-h-32 rounded-2xl border p-4" placeholder="Content EN"/><textarea value={page.content_fi} onChange={e=>setPage({...page,content_fi:e.target.value})} className="min-h-32 rounded-2xl border p-4" placeholder="Sisältö FI"/><input value={page.hero_image||""} onChange={e=>setPage({...page,hero_image:e.target.value})} className="rounded-2xl border p-4" placeholder="Hero-kuvan URL"/><label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={page.published} onChange={e=>setPage({...page,published:e.target.checked})}/> Julkaise</label><button disabled={saving} onClick={savePage} className="flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-4 font-extrabold text-white"><Save size={17}/> Tallenna sivu</button></div></div></div>}</>}
   </section>
  </div>
 </main>;
}