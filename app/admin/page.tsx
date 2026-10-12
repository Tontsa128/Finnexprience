"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { FileText, ImagePlus, LayoutDashboard, LogIn, Plus, Save, Trash2, Upload, X, MapPin, Inbox } from "lucide-react";

type Slide={id:string;image_url:string;alt_es:string;alt_en:string;alt_fi:string;eyebrow_es:string;eyebrow_en:string;eyebrow_fi:string;sort_order:number;active:boolean;source_url:string;image_credit:string;license_note:string};
type Page={id:string;slug:string;title_es:string;title_en:string;title_fi:string;content_es:string;content_en:string;content_fi:string;hero_image:string|null;published:boolean};
type TripRequest={id:string;name:string|null;email:string;travel_date:string;interest:string;message:string;locale:string;status:string;created_at:string};
type Destination={id:string;slug:string;name_es:string;name_en:string;name_fi:string;region:string;description_es:string;description_en:string;description_fi:string;image_url:string|null;provider_url:string|null;category:string;parent_id:string|null;gallery_urls:string[];featured:boolean;published:boolean;sort_order:number};

const emptyPage={slug:"",title_es:"",title_en:"",title_fi:"",content_es:"",content_en:"",content_fi:"",hero_image:"",published:false};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
function validateImageFile(file: File): string | null {
 if (!allowedImageTypes.has(file.type)) return "Valitse JPG-, PNG-, WebP- tai AVIF-kuva.";
 if (file.size > 10 * 1024 * 1024) return "Kuvan enimmäiskoko on 10 Mt.";
 return null;
}

export default function AdminPage(){
 const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 const supabase = useMemo(() => supabaseConfigured ? createSupabaseBrowserClient() : null, [supabaseConfigured]) as ReturnType<typeof createSupabaseBrowserClient>;
 const [session,setSession]=useState<any>(null),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 const [tab,setTab]=useState<"dashboard"|"hero"|"pages"|"destinations"|"requests">("dashboard"),[slides,setSlides]=useState<Slide[]>([]),[pages,setPages]=useState<Page[]>([]),[homepage,setHomepage]=useState<any>({}),[page,setPage]=useState<any>(null),[saving,setSaving]=useState(false),[destinations,setDestinations]=useState<Destination[]>([]),[requests,setRequests]=useState<TripRequest[]>([]),[destination,setDestination]=useState<any>(null);

 async function load(){
  if(!supabaseConfigured){setLoading(false);return;}
  setLoading(true);
  const {data:{session:s}}=await supabase.auth.getSession();
  if(!s){setSession(null);setLoading(false);return;}
  const {data:admin}=await supabase.from("admin_users").select("email").eq("user_id",s.user.id).maybeSingle();
  if(!admin){await supabase.auth.signOut();setError("Tällä käyttäjällä ei ole pääkäyttäjän oikeuksia.");setLoading(false);return;}
  setSession(s);
  const [sl,pg,st,ds,tr]=await Promise.all([
   supabase.from("hero_slides").select("*").order("sort_order"),
   supabase.from("pages").select("*").order("created_at",{ascending:false}),
   supabase.from("site_settings").select("value").eq("key","homepage").maybeSingle(),
   supabase.from("destinations").select("*").order("sort_order"),
   supabase.from("trip_requests").select("*").order("created_at",{ascending:false})
  ]);
  setSlides((sl.data??[]) as Slide[]);setPages((pg.data??[]) as Page[]);setDestinations((ds.data??[]) as Destination[]);setRequests((tr.data??[]) as TripRequest[]);setHomepage(st.data?.value??{});
  setLoading(false);
 }
 useEffect(()=>{load();},[]);

 if(!supabaseConfigured)return <main className="grid min-h-screen place-items-center bg-ink px-5 text-white"><section className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8"><div className="text-2xl font-extrabold">Finn<span className="text-[#e8b28f]">exprience</span></div><h1 className="mt-6 text-3xl font-extrabold">Hallinta ei ole vielä yhdistetty</h1><p className="mt-4 leading-7 text-white/70">Sivuston rakentaminen onnistuu, mutta hallintapaneeli tarvitsee Supabase-yhteyden kirjautumista ja sisällön tallennusta varten. Lisää Vercelin Project Settings → Environment Variables -kohtaan muuttujat NEXT_PUBLIC_SUPABASE_URL ja NEXT_PUBLIC_SUPABASE_ANON_KEY sekä Preview- että Production-ympäristöihin. Käynnistä sen jälkeen uusi deployment.</p><p className="mt-4 text-sm text-white/50">Älä lisää avaimia GitHub-koodiin. Älä käytä service_role-avainta selaimessa.</p><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-[#e8b28f] px-5 py-3 font-bold text-ink">Avaa Supabase Dashboard</a></section></main>;

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
  const validationError=validateImageFile(file);
  if(validationError){setError(validationError);return;}
  setError("");setSaving(true);
  const ext=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";const path=`hero/${crypto.randomUUID()}.${ext}`;
  const up=await supabase.storage.from("media").upload(path,file,{upsert:false,contentType:file.type});
  if(up.error){setError("Kuvan lataus epäonnistui. Tarkista Supabasen media-bucket ja ylläpitäjän käyttöoikeudet.");setSaving(false);return;}
  const url=supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  const saved=await supabase.from("hero_slides").insert({image_url:url,alt_es:"Viaje por Finlandia",alt_en:"Travel in Finland",alt_fi:"Matka Suomessa",eyebrow_es:"Finlandia auténtica",eyebrow_en:"Authentic Finland",eyebrow_fi:"Aitoa Suomea",source_url:"",image_credit:"",license_note:"",sort_order:slides.length,active:true});
  if(saved.error){setError("Kuva latautui, mutta sen tallennus etusivun kuviin epäonnistui: "+saved.error.message);setSaving(false);return;}
  await load();setSaving(false);
 }
 async function saveSlide(slide:Slide){
  setError("");setSaving(true);
  const {id, ...payload}=slide;
  const {error:e}=await supabase.from("hero_slides").update(payload).eq("id",id);
  if(e)setError("Etusivun kuvan tallennus epäonnistui: "+e.message);
  else await load();
  setSaving(false);
 }
 async function moveSlide(id:string,direction:-1|1){
  const ordered=[...slides].sort((a,b)=>a.sort_order-b.sort_order);
  const index=ordered.findIndex(slide=>slide.id===id), target=index+direction;
  if(index<0||target<0||target>=ordered.length)return;
  setError("");setSaving(true);
  const current=ordered[index], other=ordered[target];
  const first=await supabase.from("hero_slides").update({sort_order:other.sort_order}).eq("id",current.id);
  const second=first.error?first:await supabase.from("hero_slides").update({sort_order:current.sort_order}).eq("id",other.id);
  if(second.error)setError("Kuvien järjestyksen tallennus epäonnistui: "+second.error.message);
  await load();setSaving(false);
 }
 async function deleteSlide(id:string){setError("");const {error:e}=await supabase.from("hero_slides").delete().eq("id",id);if(e)setError("Kuvan poisto epäonnistui: "+e.message);else await load();}
 async function uploadDestinationImage(file:File){
  if(!destination)return;
  const validationError=validateImageFile(file);
  if(validationError){setError(validationError);return;}
  setError("");setSaving(true);
  const ext=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
  const path=`destinations/${crypto.randomUUID()}.${ext}`;
  const up=await supabase.storage.from("media").upload(path,file,{upsert:false,contentType:file.type});
  if(up.error){setError("Kuvan lataus epäonnistui. Tarkista Supabasen media-bucket ja sen käyttöoikeudet.");setSaving(false);return;}
  const url=supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  setDestination({...destination,image_url:url});
  setSaving(false);
 }
 async function uploadDestinationGalleryImages(files: FileList | File[]){
  if(!destination)return;
  const selected=Array.from(files);
  if(!selected.length)return;
  const invalid=selected.find(file=>validateImageFile(file));
  if(invalid){setError(validateImageFile(invalid)||"Tarkista kuvatiedosto.");return;}
  setError("");setSaving(true);
  const uploaded:string[]=[];
  for(const file of selected){
   const ext=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
   const path=`destinations/gallery/${crypto.randomUUID()}.${ext}`;
   const up=await supabase.storage.from("media").upload(path,file,{upsert:false,contentType:file.type});
   if(up.error){setError("Yhden tai useamman gallerian kuvan lataus epäonnistui. Tarkista media-bucketin käyttöoikeudet.");setSaving(false);return;}
   uploaded.push(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
  }
  setDestination({...destination,gallery_urls:[...(destination.gallery_urls||[]),...uploaded]});
  setSaving(false);
 }
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
    {([["dashboard","Yleiskatsaus",LayoutDashboard],["hero","Etusivun kuvat",ImagePlus],["pages","Sivut",FileText],["destinations","Kohteet",MapPin],["requests","Matkapyynnöt",Inbox]] as const).map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={`flex items-center gap-3 rounded-2xl p-3 text-left ${tab===id?"bg-white/10":"hover:bg-white/5"}`}><Icon size={17}/>{label}</button>)}
   </div></aside>
   <section>
    {error&&<div className="mb-5 flex items-center justify-between rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}<button onClick={()=>setError("")}><X size={16}/></button></div>}
    {tab==="dashboard"&&<><h1 className="text-4xl font-extrabold">Hallintapaneeli</h1><p className="mt-2 text-black/55">Muokkaa sivustoa ilman koodia.</p><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{slides.length}</div><p className="mt-2 text-sm text-black/55">Hero-kuvaa</p></div><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{pages.length}</div><p className="mt-2 text-sm text-black/55">Sivua</p></div><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-3xl font-extrabold">{pages.filter(p=>p.published).length}</div><p className="mt-2 text-sm text-black/55">Julkaistua</p></div></div><div className="mt-8 rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-xl font-extrabold">Etusivun espanjankielinen teksti</h2><input value={homepage.heroTitle?.es??""} onChange={e=>setHomepage({...homepage,heroTitle:{...homepage.heroTitle,es:e.target.value}})} className="mt-4 w-full rounded-2xl border p-4" /><textarea value={homepage.heroText?.es??""} onChange={e=>setHomepage({...homepage,heroText:{...homepage.heroText,es:e.target.value}})} className="mt-3 min-h-32 w-full rounded-2xl border p-4" /><div className="mt-5 grid gap-4 md:grid-cols-2">
      <div><label className="text-sm font-bold">Otsikko EN</label><input value={homepage.heroTitle?.en??""} onChange={e=>setHomepage({...homepage,heroTitle:{...homepage.heroTitle,en:e.target.value}})} className="mt-2 w-full rounded-2xl border p-4"/></div>
      <div><label className="text-sm font-bold">Otsikko FI</label><input value={homepage.heroTitle?.fi??""} onChange={e=>setHomepage({...homepage,heroTitle:{...homepage.heroTitle,fi:e.target.value}})} className="mt-2 w-full rounded-2xl border p-4"/></div>
      <div><label className="text-sm font-bold">Teksti EN</label><textarea value={homepage.heroText?.en??""} onChange={e=>setHomepage({...homepage,heroText:{...homepage.heroText,en:e.target.value}})} className="mt-2 min-h-28 w-full rounded-2xl border p-4"/></div>
      <div><label className="text-sm font-bold">Teksti FI</label><textarea value={homepage.heroText?.fi??""} onChange={e=>setHomepage({...homepage,heroText:{...homepage.heroText,fi:e.target.value}})} className="mt-2 min-h-28 w-full rounded-2xl border p-4"/></div>
     </div><button disabled={saving} onClick={saveHome} className="mt-4 flex items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Save size={16}/> Tallenna</button></div></>}
    {tab==="hero"&&<><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Etusivun kuvat</h1><p className="mt-2 text-black/55">Muokkaa jokaisen kuvan kieliversioita, järjestystä, julkaisutilaa ja käyttöoikeustietoja. Otsikko ja pääteksti pysyvät etusivulla paikoillaan.</p></div><label className="flex cursor-pointer items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Upload size={17}/> Lisää kuva<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={e=>e.target.files?.[0]&&uploadSlide(e.target.files[0])}/></label></div><div className="mt-8 grid gap-5">{[...slides].sort((a,b)=>a.sort_order-b.sort_order).map((slide,index)=><article key={slide.id} className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="grid md:grid-cols-[300px_1fr]"><div className="relative min-h-56 bg-black/5"><Image src={slide.image_url} alt={slide.alt_es||"Etusivun matkailukuva"} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover"/></div><div className="p-5 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-extrabold">Kuva {index+1}</h2><p className="text-sm text-black/50">Järjestysnumero: {slide.sort_order}</p></div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={slide.active} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,active:e.target.checked}:item))}/> Aktiivinen</label></div><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="grid gap-1 text-sm font-semibold">Yläteksti ES<input value={slide.eyebrow_es||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,eyebrow_es:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold">Eyebrow EN<input value={slide.eyebrow_en||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,eyebrow_en:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold">Yläteksti FI<input value={slide.eyebrow_fi||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,eyebrow_fi:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold">Alt-teksti ES<input value={slide.alt_es||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,alt_es:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold">Alt text EN<input value={slide.alt_en||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,alt_en:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold">Alt-teksti FI<input value={slide.alt_fi||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,alt_fi:e.target.value}:item))} className="rounded-xl border p-3 font-normal"/></label><label className="grid gap-1 text-sm font-semibold md:col-span-2">Kuvan alkuperäinen lähde / lähde-URL<input value={slide.source_url||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,source_url:e.target.value}:item))} className="rounded-xl border p-3 font-normal" placeholder="https://..."/></label><label className="grid gap-1 text-sm font-semibold">Kuvaajan nimi / tekijänoikeus<input value={slide.image_credit||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,image_credit:e.target.value}:item))} className="rounded-xl border p-3 font-normal" placeholder="Kuvaaja tai oikeudenhaltija"/></label><label className="grid gap-1 text-sm font-semibold">Lisenssi / käyttöluvan tiedot<input value={slide.license_note||""} onChange={e=>setSlides(prev=>prev.map(item=>item.id===slide.id?{...item,license_note:e.target.value}:item))} className="rounded-xl border p-3 font-normal" placeholder="Lisenssi, lupa ja ehdot"/></label></div><div className="mt-5 flex flex-wrap gap-2"><button disabled={saving||index===0} onClick={()=>moveSlide(slide.id,-1)} className="rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-40">Siirrä ylös</button><button disabled={saving||index===slides.length-1} onClick={()=>moveSlide(slide.id,1)} className="rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-40">Siirrä alas</button><button disabled={saving} onClick={()=>saveSlide(slide)} className="flex items-center gap-2 rounded-full bg-pine px-4 py-2 text-sm font-bold text-white"><Save size={15}/> Tallenna kuvan tiedot</button><button disabled={saving} onClick={()=>deleteSlide(slide.id)} className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600"><Trash2 size={15}/> Poista</button></div></div></div></article>)}</div></>}
    {tab==="requests"&&<><h1 className="text-4xl font-extrabold">Matkapyynnöt</h1><p className="mt-2 text-black/55">Sivuston kautta lähetetyt matkatoiveet. Näitä tietoja voivat lukea vain pääkäyttäjät.</p><div className="mt-8 grid gap-4">{requests.length===0?<div className="rounded-3xl bg-white p-7 text-black/50">Ei vielä saapuneita pyyntöjä.</div>:requests.map(r=><article key={r.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="font-extrabold">{r.name||"Asiakas"}</div><a className="text-sm text-copper" href={"mailto:"+r.email}>{r.email}</a></div><span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold">{r.status}</span></div><div className="mt-4 grid gap-2 text-sm text-black/60 md:grid-cols-3"><span><strong>Ajankohta:</strong> {r.travel_date}</span><span><strong>Kiinnostus:</strong> {r.interest}</span><span><strong>Kieli:</strong> {r.locale.toUpperCase()}</span></div><p className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#f5f6f2] p-4 text-sm leading-6">{r.message}</p></article>)}</div></>}{tab==="destinations"&&<><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Kohteet</h1><p className="mt-2 text-black/55">Lisää Salo, Mathildedal, Teijo ja myöhemmin koko Suomi ilman koodia.</p></div><button onClick={()=>setDestination({slug:"",name_es:"",name_en:"",name_fi:"",region:"",description_es:"",description_en:"",description_fi:"",image_url:"",provider_url:"",category:"destination",parent_id:null,gallery_urls:[],featured:false,published:false,sort_order:destinations.length})} className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Plus size={17}/> Uusi kohde</button></div><div className="mt-8 grid gap-4">{destinations.map(d=><div key={d.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm"><div><div className="font-extrabold">{d.name_es||d.slug}</div><div className="text-sm text-black/45">/{d.slug} · {d.published?"Julkaistu":"Luonnos"}</div></div><div className="flex gap-2"><button onClick={()=>setDestination(d)} className="rounded-full border px-4 py-2 text-sm font-bold">Muokkaa</button><button onClick={async()=>{await supabase.from("destinations").delete().eq("id",d.id);await load()}} className="rounded-full border px-4 py-2 text-sm font-bold text-red-600">Poista</button></div></div>)}</div>{destination&&<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-5"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-2xl font-extrabold">{destination.id?"Muokkaa kohdetta":"Uusi kohde"}</h2><button onClick={()=>setDestination(null)}><X/></button></div><div className="mt-6 grid gap-4">{[["slug","URL slug"],["name_es","Nimi ES"],["name_en","Name EN"],["name_fi","Nimi FI"],["region","Alue / maakunta"],["image_url","Kuvan URL"],["provider_url","Virallinen matkailusivusto tai palveluntarjoaja"],["category","Tyyppi (esim. alue, kaupunki, kylä, majoitus, elämys)"],["image_source_url","Kuvan alkuperäinen lähde-URL"],["image_credit","Kuvaajan nimi / tekijänoikeus"],["image_license_note","Lisenssi / käyttöluvan tiedot"],["content_checked_at","Sisällön tarkistuspäivä (YYYY-MM-DD)"]].map(([key,ph])=><input key={key} value={destination[key]??""} onChange={e=>setDestination({...destination,[key]:e.target.value})} className="rounded-2xl border p-4" placeholder={ph}/>)}
      <label className="grid gap-2 text-sm font-bold">Sijainti rakenteessa
        <select value={destination.parent_id||""} onChange={e=>setDestination({...destination,parent_id:e.target.value||null})} className="rounded-2xl border bg-white p-4 font-normal">
          <option value="">Päätason kohde (näkyy etusivun kohdelistassa)</option>
          {destinations.filter(d=>d.id!==destination.id).map(d=><option key={d.id} value={d.id}>{d.name_fi||d.name_es||d.slug} · {d.slug}</option>)}
        </select>
        <span className="font-normal text-black/50">Valitse esimerkiksi Naantali → Naantalin kylät / majoitukset / elämykset. Jokaisella alasivulla voi olla oma teksti ja kuvat.</span>
      </label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-pine/40 p-4 font-bold text-pine"><Upload size={17}/> Lataa kansikuva<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={e=>e.target.files?.[0]&&uploadDestinationImage(e.target.files[0])}/></label>
      {destination.image_url&&<div className="relative h-48 overflow-hidden rounded-2xl bg-black/5"><Image src={destination.image_url} alt={destination.name_es||"Kohteen esikatselukuva"} fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover"/></div>}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-pine/40 p-4 font-bold text-pine"><ImagePlus size={17}/> Lisää galleriaan useita kuvia<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={e=>e.target.files?.length&&uploadDestinationGalleryImages(e.target.files)}/></label>
      {(destination.gallery_urls||[]).length>0&&<div className="grid grid-cols-2 gap-3 md:grid-cols-3">{(destination.gallery_urls||[]).map((url:string)=><div key={url} className="relative h-32 overflow-hidden rounded-xl"><Image src={url} alt={destination.name_es||"Kohteen gallerian kuva"} fill sizes="200px" className="object-cover"/><button type="button" onClick={()=>setDestination({...destination,gallery_urls:destination.gallery_urls.filter((item:string)=>item!==url)})} className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600" aria-label="Poista kuva galleriasta"><X size={14}/></button></div>)}</div>}
      <div className="rounded-2xl bg-[#f5f6f2] p-5"><h3 className="font-extrabold">Kuvien vaihtoehtoiset tekstit (saavutettavuus)</h3><div className="mt-3 grid gap-3"><input value={destination.image_alt_es||""} onChange={e=>setDestination({...destination,image_alt_es:e.target.value})} className="rounded-xl border p-3" placeholder="Kuvan alt-teksti ES"/><input value={destination.image_alt_en||""} onChange={e=>setDestination({...destination,image_alt_en:e.target.value})} className="rounded-xl border p-3" placeholder="Image alt text EN"/><input value={destination.image_alt_fi||""} onChange={e=>setDestination({...destination,image_alt_fi:e.target.value})} className="rounded-xl border p-3" placeholder="Kuvan alt-teksti FI"/></div></div>
      <div className="rounded-2xl bg-[#f5f6f2] p-5"><h3 className="font-extrabold">Hakukoneoptimointi (SEO)</h3><div className="mt-3 grid gap-3"><input value={destination.seo_title_es||""} onChange={e=>setDestination({...destination,seo_title_es:e.target.value})} className="rounded-xl border p-3" placeholder="SEO-otsikko ES"/><input value={destination.seo_title_en||""} onChange={e=>setDestination({...destination,seo_title_en:e.target.value})} className="rounded-xl border p-3" placeholder="SEO title EN"/><input value={destination.seo_title_fi||""} onChange={e=>setDestination({...destination,seo_title_fi:e.target.value})} className="rounded-xl border p-3" placeholder="SEO-otsikko FI"/><textarea value={destination.seo_description_es||""} onChange={e=>setDestination({...destination,seo_description_es:e.target.value})} className="min-h-20 rounded-xl border p-3" placeholder="SEO-kuvaus ES"/><textarea value={destination.seo_description_en||""} onChange={e=>setDestination({...destination,seo_description_en:e.target.value})} className="min-h-20 rounded-xl border p-3" placeholder="SEO description EN"/><textarea value={destination.seo_description_fi||""} onChange={e=>setDestination({...destination,seo_description_fi:e.target.value})} className="min-h-20 rounded-xl border p-3" placeholder="SEO-kuvaus FI"/></div></div>
      <textarea value={destination.description_es} onChange={e=>setDestination({...destination,description_es:e.target.value})} className="min-h-32 rounded-2xl border p-4" placeholder="Descripción ES"/><textarea value={destination.description_en} onChange={e=>setDestination({...destination,description_en:e.target.value})} className="min-h-24 rounded-2xl border p-4" placeholder="Description EN"/><textarea value={destination.description_fi} onChange={e=>setDestination({...destination,description_fi:e.target.value})} className="min-h-24 rounded-2xl border p-4" placeholder="Kuvaus FI"/>
      <label className="flex items-center gap-3"><input type="checkbox" checked={destination.featured} onChange={e=>setDestination({...destination,featured:e.target.checked})}/> Nosta esiin</label><label className="flex items-center gap-3"><input type="checkbox" checked={destination.published} onChange={e=>setDestination({...destination,published:e.target.checked})}/> Julkaise</label><button disabled={saving} onClick={async()=>{setSaving(true);const payload={...destination,parent_id:destination.parent_id||null,gallery_urls:destination.gallery_urls||[],updated_at:new Date().toISOString()};const r=destination.id?await supabase.from("destinations").update(payload).eq("id",destination.id):await supabase.from("destinations").insert(payload);if(r.error)setError(r.error.message);else{setDestination(null);await load()}setSaving(false)}} className="flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-4 font-extrabold text-white"><Save size={17}/> Tallenna kohde</button></div></div></div>}</>}{tab==="pages"&&<><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-extrabold">Sivut</h1><p className="mt-2 text-black/55">Luo uusia kohde-, opas- ja kampanjasivuja.</p></div><button onClick={()=>setPage({...emptyPage})} className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 font-bold text-white"><Plus size={17}/> Uusi sivu</button></div><div className="mt-8 grid gap-4">{pages.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm"><div><div className="font-extrabold">{p.title_es||p.slug}</div><div className="mt-1 text-sm text-black/45">/{p.slug} · {p.published?"Julkaistu":"Luonnos"}</div></div><div className="flex gap-2"><button onClick={()=>setPage(p)} className="rounded-full border px-4 py-2 text-sm font-bold">Muokkaa</button><button onClick={()=>deletePage(p.id)} className="rounded-full border px-4 py-2 text-sm font-bold text-red-600">Poista</button></div></div>)}</div>{page&&<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-5"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-2xl font-extrabold">{page.id?"Muokkaa sivua":"Uusi sivu"}</h2><button onClick={()=>setPage(null)}><X/></button></div><div className="mt-6 grid gap-4"><input value={page.slug} onChange={e=>setPage({...page,slug:e.target.value})} className="rounded-2xl border p-4" placeholder="URL slug esim. mathildedal"/><input value={page.title_es} onChange={e=>setPage({...page,title_es:e.target.value})} className="rounded-2xl border p-4" placeholder="Otsikko ES"/><input value={page.title_en} onChange={e=>setPage({...page,title_en:e.target.value})} className="rounded-2xl border p-4" placeholder="Title EN"/><input value={page.title_fi} onChange={e=>setPage({...page,title_fi:e.target.value})} className="rounded-2xl border p-4" placeholder="Otsikko FI"/><textarea value={page.content_es} onChange={e=>setPage({...page,content_es:e.target.value})} className="min-h-44 rounded-2xl border p-4" placeholder="Contenido ES"/><textarea value={page.content_en} onChange={e=>setPage({...page,content_en:e.target.value})} className="min-h-32 rounded-2xl border p-4" placeholder="Content EN"/><textarea value={page.content_fi} onChange={e=>setPage({...page,content_fi:e.target.value})} className="min-h-32 rounded-2xl border p-4" placeholder="Sisältö FI"/><input value={page.hero_image||""} onChange={e=>setPage({...page,hero_image:e.target.value})} className="rounded-2xl border p-4" placeholder="Hero-kuvan URL"/><label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={page.published} onChange={e=>setPage({...page,published:e.target.checked})}/> Julkaise</label><button disabled={saving} onClick={savePage} className="flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-4 font-extrabold text-white"><Save size={17}/> Tallenna sivu</button></div></div></div>}</>}
   </section>
  </div>
 </main>;
}