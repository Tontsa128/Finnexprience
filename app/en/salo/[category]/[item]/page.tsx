import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloCategories } from "@/lib/salo-directory";
import { saloListings } from "@/lib/salo-listings";
export function generateStaticParams() { return saloListings.map(({ category, slug: item }) => ({ category, item })); }
export default async function EnglishSaloListingPage({ params }: { params: Promise<{ category: string; item: string }> }) {
  const { category, item } = await params;
  if (!saloCategories.some((entry) => entry.slug === category) || !saloListings.some((entry) => entry.category === category && entry.slug === item)) notFound();
  return <SaloDirectory locale="en" categorySlug={category} itemSlug={item} />;
}
