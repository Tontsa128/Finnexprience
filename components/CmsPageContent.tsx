import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Locale = "es" | "en" | "fi";
type Block = {
  type: string;
  title?: string;
  body?: string;
  text?: string;
  image?: string;
  alt?: string;
  caption?: string;
  images?: Array<{ image?: string; alt?: string; caption?: string }>;
  items?: Array<{ label?: string; url?: string }>;
  buttonLabel?: string;
  buttonUrl?: string;
  url?: string;
  height?: number;
  parent_slug?: string;
};

type CmsPage = {
  slug: string;
  parent_slug?: string | null;
  title_es?: string;
  title_en?: string;
  title_fi?: string;
  content_es?: string;
  content_en?: string;
  content_fi?: string;
  hero_image?: string | null;
  blocks_es?: Block[] | null;
  blocks_en?: Block[] | null;
  blocks_fi?: Block[] | null;
};

function textFor(page: Record<string, any>, field: string, locale: Locale): string {
  const localized = page[`${field}_${locale}`];
  if (typeof localized === "string" && localized.trim()) return localized;
  const fallback = page[`${field}_es`];
  return typeof fallback === "string" ? fallback : "";
}

function hrefFor(url: string | undefined, locale: Locale): { href: string; external: boolean } | null {
  if (!url?.trim()) return null;
  const candidate = url.trim();
  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return { href: locale === "es" ? candidate : `/${locale}${candidate === "/" ? "" : candidate}`, external: false };
  }
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return { href: parsed.toString(), external: true };
    }
  } catch {}
  return null;
}

function safeEmbedUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const allowed = host === "youtube.com" || host.endsWith(".youtube.com") ||
      host === "youtube-nocookie.com" || host.endsWith(".youtube-nocookie.com") ||
      host === "youtu.be" || host === "maps.google.com" ||
      host === "www.google.com" && url.pathname.startsWith("/maps");
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function CmsPageContent({ page, locale }: { page: CmsPage; locale: Locale }) {
  const raw = page[`blocks_${locale}`];
  const blocks: Block[] = Array.isArray(raw) ? raw : [];
  const listBlocks = blocks.filter((block) => block.type === "pages_list");
  let childPages: Array<Record<string, any>> = [];

  if (listBlocks.length > 0) {
    const supabase = await createSupabaseServerClient();
    const parentSlugs = [...new Set(listBlocks.map((block) => block.parent_slug || page.slug).filter(Boolean))];
    if (supabase && parentSlugs.length > 0) {
      const result = await supabase
        .from("pages")
        .select("slug,parent_slug,title_es,title_en,title_fi,description_es,description_en,description_fi,hero_image,sort_order")
        .eq("published", true)
        .in("parent_slug", parentSlugs)
        .order("sort_order", { ascending: true });
      childPages = result.data ?? [];
    }
  }

  if (blocks.length === 0) {
    const body = textFor(page as Record<string, any>, "content", locale);
    return body ? <div className="prose prose-lg mt-10 max-w-3xl whitespace-pre-wrap leading-8 text-black/70">{body}</div> : null;
  }

  return <div className="mt-10 space-y-10">
    {blocks.map((block, index) => {
      if (block.type === "text") {
        return <section key={index} className="max-w-3xl">
          {block.title && <h2 className="font-display text-3xl md:text-4xl">{block.title}</h2>}
          {block.body && <p className="mt-4 whitespace-pre-wrap text-lg leading-8 text-black/70">{block.body}</p>}
        </section>;
      }

      if (block.type === "image" && block.image) {
        return <figure key={index} className="max-w-5xl">
          <img src={block.image} alt={block.alt ?? ""} className="w-full rounded-3xl object-cover" />
          {block.caption && <figcaption className="mt-2 text-sm text-black/55">{block.caption}</figcaption>}
        </figure>;
      }

      if (block.type === "gallery" && block.images?.length) {
        return <div key={index} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.images.filter((item) => item.image).map((item, imageIndex) =>
            <figure key={imageIndex}>
              <img src={item.image} alt={item.alt ?? ""} className="aspect-[4/3] w-full rounded-2xl object-cover" />
              {item.caption && <figcaption className="mt-2 text-sm text-black/55">{item.caption}</figcaption>}
            </figure>
          )}
        </div>;
      }

      if (block.type === "buttons" && block.items?.length) {
        return <div key={index} className="flex flex-wrap gap-3">
          {block.items.map((item, itemIndex) => {
            const target = hrefFor(item.url, locale);
            if (!target || !item.label) return null;
            const className = "inline-flex items-center rounded-full bg-pine px-5 py-3 font-bold text-white transition hover:bg-ink";
            return target.external
              ? <a key={itemIndex} href={target.href} target="_blank" rel="sponsored noopener noreferrer" className={className}>{item.label}</a>
              : <Link key={itemIndex} href={target.href} className={className}>{item.label}</Link>;
          })}
        </div>;
      }

      if (block.type === "pages_list") {
        const parent = block.parent_slug || page.slug;
        const kids = childPages.filter((child) => child.parent_slug === parent);
        return <section key={index}>
          {block.title && <h2 className="mb-5 font-display text-3xl md:text-4xl">{block.title}</h2>}
          {kids.length === 0
            ? <p className="text-sm text-black/50">Tälle sivulle ei ole vielä lisätty julkaistuja alasivuja.</p>
            : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {kids.map((child) => {
                  const title = textFor(child, "title", locale) || child.slug;
                  const description = textFor(child, "description", locale);
                  const path = locale === "es" ? `/${child.slug}` : `/${locale}/${child.slug}`;
                  return <Link key={child.slug} href={path} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1">
                    {child.hero_image && <img src={child.hero_image} alt="" className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.02]" />}
                    <div className="p-5"><h3 className="font-display text-2xl">{title}</h3>{description && <p className="mt-2 text-sm leading-6 text-black/60">{description}</p>}<span className="mt-4 inline-block font-bold text-pine">Tutustu →</span></div>
                  </Link>;
                })}
              </div>}
        </section>;
      }

      if (block.type === "cta") {
        const target = hrefFor(block.buttonUrl, locale);
        return <section key={index} className="rounded-3xl bg-ink p-8 text-white md:p-12">
          {block.title && <h2 className="font-display text-3xl md:text-4xl">{block.title}</h2>}
          {block.text && <p className="mt-4 max-w-2xl leading-7 text-white/70">{block.text}</p>}
          {target && block.buttonLabel && (target.external
            ? <a href={target.href} target="_blank" rel="sponsored noopener noreferrer" className="mt-6 inline-flex rounded-full bg-[#e8b28f] px-5 py-3 font-bold text-ink">{block.buttonLabel}</a>
            : <Link href={target.href} className="mt-6 inline-flex rounded-full bg-[#e8b28f] px-5 py-3 font-bold text-ink">{block.buttonLabel}</Link>)}
        </section>;
      }

      if (block.type === "embed") {
        const safeUrl = safeEmbedUrl(block.url);
        if (!safeUrl) return <p key={index} className="text-sm text-black/55">Upotuksen osoite ei ole sallittu. Käytä YouTube- tai Google Maps -osoitetta HTTPS-yhteydellä.</p>;
        return <section key={index}>
          {block.title && <h2 className="mb-4 font-display text-3xl">{block.title}</h2>}
          <iframe src={safeUrl} title={block.title || "Upotettu sisältö"} loading="lazy" className="w-full rounded-3xl" style={{ height: Math.min(Math.max(block.height ?? 400, 250), 800) }} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </section>;
      }

      if (block.type === "contact") {
        const target = hrefFor("/planifica", locale);
        return <section key={index} className="rounded-3xl bg-white p-7 ring-1 ring-black/5">
          {block.title && <h2 className="font-display text-3xl">{block.title}</h2>}
          {block.body && <p className="mt-3 text-black/65">{block.body}</p>}
          {target && <Link href={target.href} className="mt-5 inline-flex rounded-full bg-pine px-5 py-3 font-bold text-white">{locale === "fi" ? "Suunnittele matka" : locale === "en" ? "Plan your trip" : "Planificar mi viaje"}</Link>}
        </section>;
      }

      return null;
    })}
  </div>;
}
