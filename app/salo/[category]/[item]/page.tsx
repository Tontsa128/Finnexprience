import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloCategories } from "@/lib/salo-directory";
import { saloListings } from "@/lib/salo-listings";
export async function generateMetadata({ params }: { params: Promise<{ category: string; item: string }> }): Promise<Metadata> {
  const { category, item } = await params;
  const listing = saloListings.find((entry) => entry.category === category && entry.slug === item);
  if (!listing) return {};
  const canonical = `/salo/${category}/${item}`;
  return {
    title: `${listing.title.es} | Finnexprience`,
    description: listing.description.es,
    alternates: {
      canonical,
      languages: {
        es: `/salo/${category}/${item}`,
        fi: `/fi/salo/${category}/${item}`,
        en: `/en/salo/${category}/${item}`,
      },
    },
    openGraph: {
      title: `${listing.title.es} | Finnexprience`,
      description: listing.description.es,
      type: "website",
      url: canonical,
    },
  };
}
export function generateStaticParams() { return saloListings.map(({ category, slug: item }) => ({ category, item })); }
export default async function SaloListingPage({ params }: { params: Promise<{ category: string; item: string }> }) {
  const { category, item } = await params;
  if (!saloCategories.some((entry) => entry.slug === category) || !saloListings.some((entry) => entry.category === category && entry.slug === item)) notFound();
  return <SaloDirectory locale="es" categorySlug={category} itemSlug={item} />;
}
